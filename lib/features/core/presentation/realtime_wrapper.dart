import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/network/socket_service.dart';

class RealtimeWrapper extends StatefulWidget {
  final Widget child;

  const RealtimeWrapper({
    super.key, 
    required this.child,
  });

  @override
  State<RealtimeWrapper> createState() => _RealtimeWrapperState();
}

class _RealtimeWrapperState extends State<RealtimeWrapper> {
  @override
  void initState() {
    super.initState();
    SocketService().events.listen((event) {
      final type = event['type'];
      final payload = event['payload'];

      if (type == 'order_paid') {
        _showToast('💰 Замовлення оплачено: ${payload['productTitle']}');
      } else if (type == 'sale_registered') {
        _showToast('🚀 Новий продаж: +${payload['profit']} UAH');
      }
    });
  }

  void _showToast(String message) {
    if (!mounted) return;
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message, 
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        backgroundColor: Colors.blueAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}