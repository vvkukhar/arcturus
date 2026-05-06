import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_priority_model.dart';

class InventoryReviewPriorityBanner extends ConsumerWidget {
  final InventoryReviewPriorityModel model;

  const InventoryReviewPriorityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final urgent = model.severeAlerts >= 5 || model.highRiskItems >= 5;
    final color = urgent ? Colors.redAccent : Colors.orange;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${i18n.t(model.label)} • ${i18n.t('severe')} ${model.severeAlerts} • ${i18n.t('risk')} ${model.highRiskItems}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}