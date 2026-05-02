import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_model.dart';

class ActivityConsistencyCard extends StatelessWidget {
  final ActivityConsistencyModel model;

  const ActivityConsistencyCard({
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
              'Last 7 active: ${model.activeDaysInLast7} • tracked days: ${model.totalDaysTracked}',
            ),
          ],
        ),
      ),
    );
  }
}
