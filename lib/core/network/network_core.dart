import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class NetworkCore {
  final String baseUrl;
  late final Dio _dio;
  io.Socket? _socket;
  final _eventsController = StreamController<Map<String, dynamic>>.broadcast();
  bool _isReconnectingSocket = false;
  final _storage = const FlutterSecureStorage();

  NetworkCore({required this.baseUrl}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      contentType: 'application/json',
      responseType: ResponseType.plain,
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'arcturus_jwt');
        if (token != null && token != 'cookie_session_active' && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  Stream<Map<String, dynamic>> get socketEvents => _eventsController.stream;

  Future<bool> isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }

  Stream<bool> get onlineStream {
    return Connectivity().onConnectivityChanged.map((r) => !r.contains(ConnectivityResult.none));
  }

  Future<dynamic> request(String method, String path, {Map<String, dynamic>? body, int retries = 3}) async {
    for (int i = 0; i <= retries; i++) {
      try {
        final options = Options(method: method.toUpperCase(), validateStatus: (status) => true);
        final cleanPath = path.startsWith('/') ? path.substring(1) : path;
        final url = '${_dio.options.baseUrl.endsWith('/') ? _dio.options.baseUrl : '${_dio.options.baseUrl}/'}$cleanPath';

        final response = await _dio.request(url, data: body, options: options);

        dynamic responseData;
        try {
          responseData = response.data != null && response.data.toString().isNotEmpty 
              ? jsonDecode(response.data.toString()) 
              : null;
        } catch (_) {
          responseData = response.data.toString();
        }

        if (response.statusCode != null && response.statusCode! >= 200 && response.statusCode! < 300) {
          return responseData;
        }
        
        if (response.statusCode == 401 || response.statusCode == 403) {
          await _storage.delete(key: 'arcturus_jwt');
          
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (AppRouter.navigatorKey.currentContext != null) {
              ScaffoldMessenger.of(AppRouter.navigatorKey.currentContext!).showSnackBar(
                const SnackBar(content: Text('Session expired. Please login again.'), backgroundColor: Colors.orange),
              );
              AppRouter.navigatorKey.currentState?.pushNamedAndRemoveUntil(AppRouter.login, (route) => false);
            }
          });

          throw Exception('Unauthorized access. Please login again.');
        }
        
        String errorMessage = 'Status ${response.statusCode}';
        if (responseData is Map && responseData['message'] != null) {
          final msg = responseData['message'];
          errorMessage = msg is List ? msg.join(', ') : msg.toString();
        } else if (responseData != null) {
          errorMessage = responseData.toString();
        }
        
        throw Exception(errorMessage);
        
      } catch (e) {
        final errStr = e.toString().replaceAll('Exception: ', '');
        if (errStr.contains('Unauthorized access')) throw Exception(errStr);
        if (i == retries) throw Exception(errStr);
        await Future.delayed(Duration(milliseconds: (pow(2, i) * 500).toInt() + Random().nextInt(500)));
      }
    }
  }

  Future<void> initSocket() async {
    if (_isReconnectingSocket) return;
    _isReconnectingSocket = true;

    try {
      if (_socket != null) {
        _socket!.disconnect();
        _socket!.dispose();
      }

      final token = await _storage.read(key: 'arcturus_jwt');
      
      if (token == null || token.isEmpty || token == 'cookie_session_active') return;

      final uri = Uri.parse(baseUrl);
      final socketUrl = '${uri.scheme}://${uri.host}${uri.hasPort ? ':${uri.port}' : ''}';
      
      _socket = io.io(
        socketUrl, 
        io.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .enableReconnection()
          .setReconnectionDelay(1000)
          .setReconnectionDelayMax(5000)
          .setReconnectionAttempts(double.maxFinite.toInt())
          .setAuth({'token': token})
          .build(),
      );

      _socket?.onConnect((_) => _eventsController.add({'type': 'system.connected'}));
      _socket?.onDisconnect((_) => _eventsController.add({'type': 'system.disconnected'}));
      _socket?.onAny((event, data) => _eventsController.add({'type': event, 'payload': data}));
      
    } finally {
      _isReconnectingSocket = false;
    }
  }

  Future<void> refreshSocketToken() async {
    await initSocket();
  }

  void dispose() {
    _socket?.disconnect();
    _socket?.dispose();
    _eventsController.close();
    _dio.close();
  }
}