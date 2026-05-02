import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_stability_model.dart';

class ActivityWeeklyStabilityBanner extends StatelessWidget {
  final ActivityWeeklyStabilityModel model;

  const ActivityWeeklyStabilityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.cyan.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.activeDaysInLast7}/7 active days',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
