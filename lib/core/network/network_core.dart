import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class NetworkCore {
  final String baseUrl;
  final http.Client _client;
  final FlutterSecureStorage _secureStorage;
  io.Socket? _socket;
  final _eventsController = StreamController<Map<String, dynamic>>.broadcast();

  NetworkCore({required this.baseUrl, http.Client? client}) 
      : _client = client ?? http.Client(),
        _secureStorage = const FlutterSecureStorage();

  Stream<Map<String, dynamic>> get socketEvents => _eventsController.stream;

  Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }

  Stream<bool> get onlineStream {
    return Connectivity().onConnectivityChanged.map((r) => !r.contains(ConnectivityResult.none));
  }

  Future<Map<String, String>> _headers() async {
    final token = await _secureStorage.read(key: 'arcturus_jwt');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> request(String method, String path, {Map<String, dynamic>? body, int retries = 3}) async {
    final uri = Uri.parse('$baseUrl$path');
    
    for (int i = 0; i <= retries; i++) {
      try {
        final headers = await _headers();
        http.Response res;

        switch (method.toUpperCase()) {
          case 'GET': res = await _client.get(uri, headers: headers); break;
          case 'POST': res = await _client.post(uri, headers: headers, body: body != null ? jsonEncode(body) : null); break;
          case 'PUT': res = await _client.put(uri, headers: headers, body: body != null ? jsonEncode(body) : null); break;
          case 'PATCH': res = await _client.patch(uri, headers: headers, body: body != null ? jsonEncode(body) : null); break;
          case 'DELETE': res = await _client.delete(uri, headers: headers, body: body != null ? jsonEncode(body) : null); break;
          default: throw Exception('METHOD_NOT_SUPPORTED');
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.body.isEmpty) return null;
          return jsonDecode(res.body);
        }
        
        if (res.statusCode == 401 || res.statusCode == 403) throw Exception('UNAUTHORIZED');
        
        // Викидаємо помилку з деталями від бекенду
        final errorBody = jsonDecode(res.body);
        throw Exception(errorBody['message'] ?? 'API_ERROR_${res.statusCode}');
        
      } catch (e) {
        if (e.toString().contains('UNAUTHORIZED') || e.toString().contains('API_ERROR')) rethrow;
        if (i == retries) throw Exception('NETWORK_FAILURE');
        await Future.delayed(Duration(milliseconds: 500 * (1 << i)));
      }
    }
  }

  Future<void> initSocket() async {
    if (_socket != null && _socket!.connected) return;
    
    final token = await _secureStorage.read(key: 'arcturus_jwt');
    if (token == null) return;

    final socketUrl = baseUrl.replaceAll(RegExp(r'/api/?$'), '');
    
    _socket = io.io(
      socketUrl, 
      io.OptionBuilder()
        .setTransports(['websocket'])
        .enableAutoConnect()
        .enableReconnection()
        .setReconnectionAttempts(10)
        .setReconnectionDelay(1000)
        .setReconnectionDelayMax(5000)
        .setAuth({'token': token})
        .build(),
    );

    _socket?.onConnect((_) => _eventsController.add({'type': 'system.connected'}));
    _socket?.onDisconnect((_) => _eventsController.add({'type': 'system.disconnected'}));
    _socket?.onAny((event, data) => _eventsController.add({'type': event, 'payload': data}));
  }

  Future<void> refreshSocketToken() async {
    _socket?.disconnect();
    await initSocket();
  }

  void dispose() {
    _socket?.disconnect();
    _socket?.dispose();
    _eventsController.close();
    _client.close();
  }
}