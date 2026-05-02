import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/partout/application/partout_summary_provider.dart';

class PartOutSummaryCard extends StatelessWidget {
  final PartOutSummaryModel summary;
  final String currency;

  const PartOutSummaryCard({
    super.key,
    required this.summary,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    Widget row(String label, String value) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ],
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            row('Projects', summary.projectCount.toString()),
            row('Lines', summary.lineCount.toString()),
            row(
              'Total Cost',
              CurrencyFormatter.format(summary.totalCost, currency: currency),
            ),
            row(
              'Expected Value',
              CurrencyFormatter.format(summary.expectedValue,
                  currency: currency),
            ),
            row(
              'Actual Value',
              CurrencyFormatter.format(summary.actualValue, currency: currency),
            ),
          ],
        ),
      ),
    );
  }
}
