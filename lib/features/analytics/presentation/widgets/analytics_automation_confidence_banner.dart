import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_confidence_model.dart';

class AnalyticsAutomationConfidenceBanner extends ConsumerWidget {
  final AnalyticsAutomationConfidenceModel model;

  const AnalyticsAutomationConfidenceBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        i18n.t(model.label),
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}