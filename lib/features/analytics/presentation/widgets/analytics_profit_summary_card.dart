import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_summary_model.dart';

class AnalyticsProfitSummaryCard extends ConsumerWidget {
  final AnalyticsProfitSummaryModel model;

  const AnalyticsProfitSummaryCard({
    super.key,
    required this.model,
  });

  Widget _row(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final profitColor =
        model.totalExpectedProfit >= 0 ? Colors.green : Colors.redAccent;
    final roiColor = model.roiPercent >= 0 ? Colors.green : Colors.redAccent;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row(i18n.t('Total Cost'), model.totalCost.toStringAsFixed(2)),
            _row(
              i18n.t('Expected Revenue'),
              model.totalExpectedRevenue.toStringAsFixed(2),
            ),
            _row(
              i18n.t('inv.expectedProfit'),
              model.totalExpectedProfit.toStringAsFixed(2),
              valueColor: profitColor,
            ),
            _row(
              'ROI',
              '${model.roiPercent.toStringAsFixed(1)}%',
              valueColor: roiColor,
            ),
          ],
        ),
      ),
    );
  }
}