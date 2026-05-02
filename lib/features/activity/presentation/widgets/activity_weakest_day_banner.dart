import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weakest_day_model.dart';

class ActivityWeakestDayBanner extends StatelessWidget {
  final ActivityWeakestDayModel? model;

  const ActivityWeakestDayBanner({
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
        color: Colors.orange.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        'Weakest day: ${model!.dateLabel} • ${model!.total} events',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
