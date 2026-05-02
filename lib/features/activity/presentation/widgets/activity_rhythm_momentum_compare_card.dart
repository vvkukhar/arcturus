import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_rhythm_momentum_compare_model.dart';

class ActivityRhythmMomentumCompareCard extends StatelessWidget {
  final ActivityRhythmMomentumCompareModel model;

  const ActivityRhythmMomentumCompareCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.label,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Weekly active ${model.weeklyActiveDays} • streak ${model.streakDays}',
            ),
          ],
        ),
      ),
    );
  }
}
