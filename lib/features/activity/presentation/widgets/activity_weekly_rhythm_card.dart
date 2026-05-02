import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_model.dart';

class ActivityWeeklyRhythmCard extends StatelessWidget {
  final ActivityWeeklyRhythmModel model;

  const ActivityWeeklyRhythmCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              '${model.activeDaysInLast7}/7',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
