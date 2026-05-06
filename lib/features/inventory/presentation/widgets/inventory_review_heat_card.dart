import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_model.dart';

class InventoryReviewHeatCard extends ConsumerWidget {
  final InventoryReviewHeatModel model;

  const InventoryReviewHeatCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final color = model.heatScore >= 25
        ? Colors.redAccent
        : model.heatScore >= 12
            ? Colors.orange
            : model.heatScore > 0
                ? Colors.blue
                : Colors.green;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                i18n.t(model.label),
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              model.heatScore.toStringAsFixed(1),
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}