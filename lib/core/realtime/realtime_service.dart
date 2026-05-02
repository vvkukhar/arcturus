import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:lego_trading_manager/core/config/api_config.dart';
import 'package:lego_trading_manager/core/realtime/realtime_event.dart';

class RealtimeService {
  io.Socket? _socket;
  final _controller = StreamController<RealtimeEvent>.broadcast();

  Stream<RealtimeEvent> get events => _controller.stream;

  void connect() {
    if (_socket != null) {
      return;
    }

    final base = ApiConfig.baseUrl.replaceFirst('/api', '');
    _socket = io.io(
      '$base/realtime',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _socket!.onConnect((_) {
      _socket!.emit('join_dashboard');
    });

    _socket!.on('dashboard_refresh', (data) {
      _controller.add(
        RealtimeEvent(
          type: 'dashboard_refresh',
          payload: Map<String, dynamic>.from(data as Map),
        ),
      );
    });

    _socket!.on('flow_refresh', (data) {
      _controller.add(
        RealtimeEvent(
          type: 'flow_refresh',
          payload: Map<String, dynamic>.from(data as Map),
        ),
      );
    });

    _socket!.on('opportunity_refresh', (data) {
      _controller.add(
        RealtimeEvent(
          type: 'opportunity_refresh',
          payload: Map<String, dynamic>.from(data as Map),
        ),
      );
    });

    _socket!.on('item_refresh', (data) {
      _controller.add(
        RealtimeEvent(
          type: 'item_refresh',
          payload: Map<String, dynamic>.from(data as Map),
        ),
      );
    });

    _socket!.connect();
  }

  void disconnect() {
    _socket?.emit('leave_dashboard');
    _socket?.dispose();
    _socket = null;
  }

  void dispose() {
    disconnect();
    _controller.close();
  }
}
