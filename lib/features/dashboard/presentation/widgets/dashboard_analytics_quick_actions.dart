import 'package:flutter/material.dart';

class DashboardAnalyticsQuickActions extends StatelessWidget {
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
  Widget build(BuildContext context) {
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
              label: const Text('Open Analytics'),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenInventory,
              icon: const Icon(Icons.inventory_2_outlined),
              label: const Text('Open Inventory'),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenDealEvaluator,
              icon: const Icon(Icons.local_fire_department_outlined),
              label: const Text('Deal Evaluator'),
            ),
          ],
        ),
      ),
    );
  }
}