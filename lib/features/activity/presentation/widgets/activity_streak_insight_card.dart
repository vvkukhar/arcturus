import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_insight_model.dart';

class ActivityStreakInsightCard extends StatelessWidget {
  final ActivityStreakInsightModel model;

  const ActivityStreakInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Chip(
          label: Text('${model.label} (${model.value})'),
        ),
      ),
    );
  }
}
