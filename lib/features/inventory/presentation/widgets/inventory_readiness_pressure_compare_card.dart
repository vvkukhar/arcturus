import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_readiness_pressure_compare_model.dart';

class InventoryReadinessPressureCompareCard extends ConsumerWidget {
  final InventoryReadinessPressureCompareModel model;

  const InventoryReadinessPressureCompareCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final positive = model.readiness >= model.pressure;
    final color = positive ? Colors.green : Colors.redAccent;
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(model.label),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${i18n.t('Readiness')} ${model.readiness.toStringAsFixed(0)} • ${i18n.t('Pressure')} ${model.pressure.toStringAsFixed(0)}',
              style: TextStyle(color: color),
            ),
          ],
        ),
      ),
    );
  }
}