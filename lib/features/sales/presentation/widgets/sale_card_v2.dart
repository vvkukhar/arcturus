import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_stock_flow_status_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sale_stock_flow_status_badge.dart';
import 'package:lego_trading_manager/features/sales/application/sale_link_status_model.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_link_status_badge.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_quick_action_bar.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_status_badge.dart';

class SaleCardV2 extends StatelessWidget {
  final SaleModel sale;
  final String statusLabel;
  final SaleLinkStatusModel linkStatus;
  final SaleStockFlowStatusModel stockStatus;
  final VoidCallback onOpenDetails;
  final VoidCallback onDuplicate;
  final VoidCallback onSaveReport;

  const SaleCardV2({
    super.key,
    required this.sale,
    required this.statusLabel,
    required this.linkStatus,
    required this.stockStatus,
    required this.onOpenDetails,
    required this.onDuplicate,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    final date = sale.saleDate.toIso8601String().split('T').first;

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
                    sale.platform,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                SaleStatusBadge(label: statusLabel),
              ],
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                SaleLinkStatusBadge(model: linkStatus),
                SaleStockFlowStatusBadge(model: stockStatus),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Item: ${sale.itemId}',
              style: const TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('Price: ${sale.salePrice.toStringAsFixed(2)}'),
                Text('Fee: ${sale.platformFee.toStringAsFixed(2)}'),
                Text('Ship: ${sale.shippingByMe.toStringAsFixed(2)}'),
                Text('Qty: ${sale.quantity}'),
                Text('Date: $date'),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Net: ${CurrencyFormatter.format(sale.finalNet, currency: sale.currency)}',
              style: const TextStyle(fontWeight: FontWeight.w900),
            ),
            Text(
              'Unit net: ${CurrencyFormatter.format(sale.unitNet, currency: sale.currency)}',
              style: const TextStyle(color: Colors.white70),
            ),
            if ((sale.buyerName ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 6),
              Text('Buyer: ${sale.buyerName}'),
            ],
            if ((sale.note ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                sale.note!.trim(),
                style: const TextStyle(color: Colors.white70),
              ),
            ],
            const SizedBox(height: 12),
            SaleQuickActionBar(
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