import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_metrics_summary_model.dart';

class InventoryMetricsSummaryCard extends ConsumerWidget {
  final InventoryMetricsSummaryModel model;

  const InventoryMetricsSummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String title, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell(i18n.t('Items'), model.totalItems.toString()),
                _cell(i18n.t('Tracked'), model.trackedItems.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(i18n.t('Cost'), model.totalCost.toStringAsFixed(2)),
                _cell(i18n.t('Revenue'), model.expectedRevenue.toStringAsFixed(2)),
                _cell(i18n.t('Profit'), model.expectedProfit.toStringAsFixed(2)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}