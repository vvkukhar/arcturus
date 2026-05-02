import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_mode_insight_model.dart';

class AnalyticsRunModeInsightBanner extends StatelessWidget {
  final AnalyticsRunModeInsightModel model;

  const AnalyticsRunModeInsightBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.indigo.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        model.label,
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
