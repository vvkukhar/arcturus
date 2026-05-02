import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_most_active_day_model.dart';

class ActivityMostActiveDayBanner extends StatelessWidget {
  final ActivityMostActiveDayModel? model;

  const ActivityMostActiveDayBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.blue.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        'Most active day: ${model!.dateLabel} • ${model!.total} events',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
