import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_model.dart';

class InventoryAlertOverviewCard extends ConsumerWidget {
  final InventoryAlertOverviewModel model;

  const InventoryAlertOverviewCard({
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            _cell(i18n.t('Alerts'), model.totalAlerts.toString()),
            _cell(i18n.t('Items'), model.uniqueItems.toString()),
            _cell(i18n.t('Severe'), model.severeAlerts.toString()),
          ],
        ),
      ),
    );
  }
}