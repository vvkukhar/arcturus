import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_summary_model.dart';

class InventoryAlertSeveritySummaryCard extends ConsumerWidget {
  final InventoryAlertSeveritySummaryModel model;

  const InventoryAlertSeveritySummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('${i18n.t('Low')}: ${model.low}')),
            Chip(label: Text('${i18n.t('Medium')}: ${model.medium}')),
            Chip(label: Text('${i18n.t('High')}: ${model.high}')),
          ],
        ),
      ),
    );
  }
}