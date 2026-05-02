import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_unmatched_summary_model.dart';

class SalesUnmatchedSummaryCard extends StatelessWidget {
  final SalesUnmatchedSummaryModel model;
  final String currency;

  const SalesUnmatchedSummaryCard({
    super.key,
    required this.model,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    final hasUnmatched = model.unmatchedCount > 0;
    final color = hasUnmatched ? Colors.orange : Colors.green;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Icon(
              hasUnmatched ? Icons.link_off_outlined : Icons.link_outlined,
              color: color,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            Text(
              '${model.unmatchedCount} sales • ${model.unmatchedUnits} units • ${model.unmatchedNet.toStringAsFixed(2)} $currency',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w900,
              ),
              textAlign: TextAlign.right,
            ),
          ],
        ),
      ),
    );
  }
}