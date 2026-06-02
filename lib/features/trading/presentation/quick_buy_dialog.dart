import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/network_core.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class QuickBuyDialog extends ConsumerStatefulWidget {
  final String listingId;
  final String title;
  final double price;

  const QuickBuyDialog({super.key, required this.listingId, required this.title, required this.price});

  @override
  ConsumerState<QuickBuyDialog> createState() => _QuickBuyDialogState();
}

class _QuickBuyDialogState extends ConsumerState<QuickBuyDialog> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _delivery = TextEditingController();
  bool _isProcessing = false;

  Future<void> _executeBuy() async {
    if (_name.text.isEmpty || _phone.text.isEmpty || _delivery.text.isEmpty) return;

    setState(() => _isProcessing = true);
    final network = ref.read(networkCoreProvider);

    try {
      final reserveRes = await network.request('POST', '/public/reserve', body: {
        'inventoryItemId': widget.listingId,
        'productTitle': widget.title,
        'name': _name.text,
        'contact': _phone.text,
        'message': '1-Click App Buy. ${_delivery.text}',
        'quantity': 1,
      });

      final orderId = reserveRes['orderId'] ?? reserveRes['id'];
      
      final checkoutRes = await network.request('POST', '/store/checkout', body: {
        'orderId': orderId
      });

      if (mounted) {
        Navigator.pop(context, checkoutRes['url']);
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Payment init failed: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: const Color(0xFF171A21),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.bolt, color: Colors.blueAccent, size: 28),
                const SizedBox(width: 8),
                const Text('1-Click Buy', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
              ],
            ),
            const SizedBox(height: 16),
            Text(widget.title, style: const TextStyle(color: Colors.white70, fontSize: 14)),
            const SizedBox(height: 8),
            Text('${widget.price} UAH', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white)),
            const SizedBox(height: 24),
            TextField(controller: _name, decoration: const InputDecoration(labelText: 'Full Name')),
            const SizedBox(height: 12),
            TextField(controller: _phone, decoration: const InputDecoration(labelText: 'Phone Number')),
            const SizedBox(height: 12),
            TextField(controller: _delivery, decoration: const InputDecoration(labelText: 'City & Branch (Nova Poshta)')),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: FilledButton.icon(
                style: FilledButton.styleFrom(backgroundColor: Colors.blueAccent),
                onPressed: _isProcessing ? null : _executeBuy,
                icon: _isProcessing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.credit_card),
                label: const Text('Pay Securely', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}