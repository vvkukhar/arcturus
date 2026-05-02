import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseStockBadge extends StatelessWidget {
  final PurchaseModel purchase;

  const PurchaseStockBadge({
    super.key,
    required this.purchase,
  });

  Color _color() {
    if (purchase.remainingQuantity <= 0) return Colors.grey;
    if (purchase.remainingQuantity < purchase.quantity) return Colors.orange;
    return Colors.green;
  }

  String _label() {
    if (purchase.remainingQuantity <= 0) return 'sold out';
    if (purchase.remainingQuantity < purchase.quantity) return 'partial';
    return 'in stock';
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '${_label()} ${purchase.remainingQuantity}/${purchase.quantity}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}