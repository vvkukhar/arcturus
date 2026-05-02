import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_consistency_ratio_model.dart';

class ActivityWeeklyConsistencyRatioCard extends StatelessWidget {
  final ActivityWeeklyConsistencyRatioModel model;

  const ActivityWeeklyConsistencyRatioCard({
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
              model.ratio.toStringAsFixed(2),
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
