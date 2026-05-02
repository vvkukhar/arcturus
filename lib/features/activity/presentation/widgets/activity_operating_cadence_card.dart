import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operating_cadence_model.dart';

class ActivityOperatingCadenceCard extends StatelessWidget {
  final ActivityOperatingCadenceModel model;

  const ActivityOperatingCadenceCard({
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
              'Weekly active ${model.weeklyActiveDays} • control ${model.controlScore.toStringAsFixed(0)}',
            ),
          ],
        ),
      ),
    );
  }
}
