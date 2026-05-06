import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_stability_model.dart';

class AnalyticsAutomationStabilityCard extends ConsumerWidget {
  final AnalyticsAutomationStabilityModel model;

  const AnalyticsAutomationStabilityCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final color = !model.scheduleEnabled
        ? Colors.grey
        : model.totalRuns >= 12
            ? Colors.green
            : model.totalRuns >= 5
                ? Colors.blue
                : Colors.orange;

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
              model.totalRuns.toString(),
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