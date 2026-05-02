import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_quick_action_bar.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_status_badge.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_stock_badge.dart';

class PurchaseCardV2 extends StatelessWidget {
  final PurchaseModel purchase;
  final String statusLabel;
  final VoidCallback onOpenDetails;
  final VoidCallback onDuplicate;
  final VoidCallback onSaveReport;

  const PurchaseCardV2({
    super.key,
    required this.purchase,
    required this.statusLabel,
    required this.onOpenDetails,
    required this.onDuplicate,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    final date = purchase.purchaseDate.toIso8601String().split('T').first;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    purchase.source,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                PurchaseStockBadge(purchase: purchase),
                const SizedBox(width: 8),
                PurchaseStatusBadge(label: statusLabel),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Item: ${purchase.itemId}',
              style: const TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('Total: ${CurrencyFormatter.format(purchase.finalTotal, currency: purchase.currency)}'),
                Text('Unit: ${CurrencyFormatter.format(purchase.unitCost, currency: purchase.currency)}'),
                Text('Qty: ${purchase.quantity}'),
                Text('Sold: ${purchase.soldQuantity}'),
                Text('Date: $date'),
              ],
            ),
            if ((purchase.note ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                purchase.note!.trim(),
                style: const TextStyle(color: Colors.white70),
              ),
            ],
            const SizedBox(height: 12),
            PurchaseQuickActionBar(
              onOpenDetails: onOpenDetails,
              onDuplicate: onDuplicate,
              onSaveReport: onSaveReport,
            ),
          ],
        ),
      ),
    );
  }
}