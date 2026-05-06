import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_service.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class RealtimeWrapper extends ConsumerStatefulWidget {
  final Widget child;

  const RealtimeWrapper({
    super.key, 
    required this.child,
  });

  @override
  ConsumerState<RealtimeWrapper> createState() => _RealtimeWrapperState();
}

class _RealtimeWrapperState extends ConsumerState<RealtimeWrapper> {
  @override
  void initState() {
    super.initState();
    SocketService().events.listen((event) {
      final type = event['type'];
      final payload = event['payload'];
      final i18n = ref.read(i18nProvider.notifier);

      if (type == 'order_paid') {
        _showToast(i18n.t('realtime.orderPaid', {'title': payload['productTitle']}));
      } else if (type == 'sale_registered') {
        _showToast(i18n.t('realtime.newSale', {'profit': payload['profit'].toString()}));
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