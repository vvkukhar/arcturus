import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/partout/application/partout_summary_provider.dart';

class PartOutSummaryCard extends ConsumerWidget {
  final PartOutSummaryModel summary;
  final String currency;

  const PartOutSummaryCard({
    super.key,
    required this.summary,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    Widget row(String label, String value) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Expanded(child: Text(i18n.t(label))),
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
              'inv.totalCost',
              CurrencyFormatter.format(summary.totalCost, currency: currency),
            ),
            row(
              'Expected Value',
              CurrencyFormatter.format(summary.expectedValue, currency: currency),
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