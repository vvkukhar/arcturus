import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  io.Socket? _socket;
  final _eventsController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get events => _eventsController.stream;

  void init(String baseUrl, String token) {
    if (_socket != null) return;

    _socket = io.io(
      baseUrl, 
      io.OptionBuilder()
        .setTransports(['websocket'])
        .enableAutoConnect()
        .setExtraHeaders({'Authorization': 'Bearer $token'})
        .build(),
    );

    _socket?.onConnect((_) {
      debugPrint('[Socket] Connected to Arcturus Core');
    });

    _socket?.on('sale_registered', (data) => _emitEvent('sale_registered', data));
    _socket?.on('inventory_updated', (data) => _emitEvent('inventory_updated', data));
    _socket?.on('order_paid', (data) => _emitEvent('order_paid', data));
    _socket?.on('notification', (data) => _emitEvent('notification', data));

    _socket?.onDisconnect((_) => debugPrint('[Socket] Disconnected'));
  }

  void _emitEvent(String type, dynamic payload) {
    _eventsController.add({'type': type, 'payload': payload});
  }

  void dispose() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}