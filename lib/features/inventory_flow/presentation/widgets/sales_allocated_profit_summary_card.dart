import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_allocated_profit_summary_model.dart';

class SalesAllocatedProfitSummaryCard extends ConsumerWidget {
  final SalesAllocatedProfitSummaryModel model;
  final String currency;

  const SalesAllocatedProfitSummaryCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Color _color() {
    if (model.allocatedProfit > 0) return Colors.green;
    if (model.allocatedProfit == 0) return Colors.orange;
    return Colors.redAccent;
  }

  Widget _cell(String label, String value, {Color? color}) {
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
            style: TextStyle(
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _color();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Allocated Profit'),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(i18n.t('Sales'), model.totalSales.toString()),
                _cell(i18n.t('Allocated'), model.allocatedSales.toString()),
                _cell(i18n.t('Open'), model.unallocatedSales.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(i18n.t('Units'), '${model.allocatedUnits}/${model.totalUnits}'),
                _cell(i18n.t('Open units'), model.unallocatedUnits.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  i18n.t('Cost'),
                  '${model.allocatedCost.toStringAsFixed(2)} $currency',
                ),
                _cell(
                  i18n.t('Profit'),
                  '${model.allocatedProfit.toStringAsFixed(2)} $currency',
                  color: color,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  i18n.t('Avg ROI'),
                  '${model.averageAllocatedRoiPercent.toStringAsFixed(1)}%',
                  color: color,
                ),
                _cell(
                  i18n.t('Avg unit profit'),
                  '${model.averageUnitProfit.toStringAsFixed(2)} $currency',
                  color: color,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}