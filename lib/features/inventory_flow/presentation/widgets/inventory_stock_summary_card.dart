import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_summary_model.dart';

class InventoryStockSummaryCard extends ConsumerWidget {
  final InventoryStockSummaryModel model;

  const InventoryStockSummaryCard({
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
              fontWeight: FontWeight.w900,
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
                _cell(i18n.t('Purchased'), model.totalPurchasedUnits.toString()),
                _cell(i18n.t('Sold'), model.totalSoldUnits.toString()),
                _cell(i18n.t('Remaining'), model.totalRemainingUnits.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(i18n.t('Open lots'), model.openPurchaseLots.toString()),
                _cell(i18n.t('Closed lots'), model.fullySoldLots.toString()),
              ],
            ),
          ],
        ),
      ),
    );
  }
}