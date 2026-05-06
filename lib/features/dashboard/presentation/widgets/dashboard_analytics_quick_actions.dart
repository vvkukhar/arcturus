import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DashboardAnalyticsQuickActions extends ConsumerWidget {
  final VoidCallback onOpenAnalytics;
  final VoidCallback onOpenInventory;
  final VoidCallback onOpenDealEvaluator;

  const DashboardAnalyticsQuickActions({
    super.key,
    required this.onOpenAnalytics,
    required this.onOpenInventory,
    required this.onOpenDealEvaluator,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonalIcon(
              onPressed: onOpenAnalytics,
              icon: const Icon(Icons.analytics_outlined),
              label: Text(i18n.t('Open Analytics')),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenInventory,
              icon: const Icon(Icons.inventory_2_outlined),
              label: Text(i18n.t('Open Inventory')),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenDealEvaluator,
              icon: const Icon(Icons.local_fire_department_outlined),
              label: Text(i18n.t('Deal Evaluator')),
            ),
          ],
        ),
      ),
    );
  }
}