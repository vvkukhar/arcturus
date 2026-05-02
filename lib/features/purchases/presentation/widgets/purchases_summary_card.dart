import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_summary_provider.dart';

class PurchasesSummaryCard extends StatelessWidget {
  final PurchasesSummaryModel model;

  const PurchasesSummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell('Purchases', model.total.toString()),
                _cell('Total spend', model.totalSpend.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Average', model.averageSpend.toStringAsFixed(2)),
                _cell('Top currency', model.topCurrency),
              ],
            ),
          ],
        ),
      ),
    );
  }
}