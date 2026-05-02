import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_model.dart';

class ActivityStreakCard extends StatelessWidget {
  final ActivityStreakModel model;

  const ActivityStreakCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Active streak ${model.activeDayStreak}d')),
            Chip(label: Text('Purchase streak ${model.purchaseDayStreak}d')),
          ],
        ),
      ),
    );
  }
}
