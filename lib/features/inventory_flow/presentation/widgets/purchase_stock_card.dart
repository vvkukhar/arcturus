import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseStockCard extends StatelessWidget {
  final PurchaseModel purchase;
  final VoidCallback? onTap;

  const PurchaseStockCard({
    super.key,
    required this.purchase,
    this.onTap,
  });

  Color _color() {
    if (purchase.remainingQuantity <= 0) return Colors.grey;
    if (purchase.remainingQuantity < purchase.quantity) return Colors.orange;
    return Colors.green;
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();
    final date = purchase.purchaseDate.toIso8601String().split('T').first;

    return Card(
      child: ListTile(
        onTap: onTap,
        title: Text(
          purchase.source,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(
          'Item ${purchase.itemId} • $date • unit ${CurrencyFormatter.format(purchase.unitCost, currency: purchase.currency)}',
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(
            '${purchase.remainingQuantity}/${purchase.quantity}',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
      ),
    );
  }
}