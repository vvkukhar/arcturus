import 'dart:async';
import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class NetworkCore {
  final String baseUrl;
  late final Dio _dio;
  io.Socket? _socket;
  final _eventsController = StreamController<Map<String, dynamic>>.broadcast();

  NetworkCore({required this.baseUrl}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 45), // Даємо час бекенду на Render прокинутись
      receiveTimeout: const Duration(seconds: 45),
      contentType: 'application/json',
      responseType: ResponseType.json,
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('arcturus_jwt');
        
        // Відправляємо справжній токен
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
        final options = Options(
          method: method.toUpperCase(),
          // Приймаємо будь-який статус, щоб вручну прочитати текст помилки
          validateStatus: (status) => true, 
        );

        final response = await _dio.request(path, data: body, options: options);

        if (response.statusCode != null && response.statusCode! >= 200 && response.statusCode! < 300) {
          return response.data;
        }
        
        if (response.statusCode == 401 || response.statusCode == 403) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.remove('arcturus_jwt');
          throw Exception('Unauthorized access. Please login again.');
        }
        
        // Витягуємо РЕАЛЬНУ помилку від NestJS / Prisma
        String errorMessage = 'Status ${response.statusCode}';
        if (response.data != null) {
          if (response.data is Map && response.data['message'] != null) {
            final msg = response.data['message'];
            errorMessage = msg is List ? msg.join(', ') : msg.toString();
          } else {
            errorMessage = response.data.toString();
          }
        }
        throw Exception(errorMessage);
        
      } catch (e) {
        final errStr = e.toString().replaceAll('Exception: ', '');
        
        if (errStr.contains('Unauthorized access')) {
          throw Exception(errStr);
        }
        
        if (i == retries) {
          if (errStr.contains('XMLHttpRequest')) {
            throw Exception('Server is waking up. Please try again in 20 seconds.');
          }
          throw Exception(errStr);
        }
        
        await Future.delayed(Duration(milliseconds: 1000 * (i + 1)));
      }
    }
  }

  Future<void> initSocket() async {
    if (_socket != null && _socket!.connected) return;
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('arcturus_jwt');
    
    if (token == null || token.isEmpty || token == 'cookie_session_active') return;

    final uri = Uri.parse(baseUrl);
    final socketUrl = '${uri.scheme}://${uri.host}${uri.hasPort ? ':${uri.port}' : ''}';
    
    _socket = io.io(
      socketUrl, 
      io.OptionBuilder()
        .setTransports(['websocket'])
        .enableAutoConnect()
        .enableReconnection()
        .setReconnectionAttempts(10)
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
    _dio.close();
  }
}