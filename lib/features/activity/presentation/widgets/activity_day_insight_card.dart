import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_day_insight_model.dart';

class ActivityDayInsightCard extends StatelessWidget {
  final ActivityDayInsightModel? model;

  const ActivityDayInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(
                label:
                    Text('Best: ${model!.bestDay} (${model!.bestDayTotal})')),
            Chip(
              label: Text(
                'Weakest: ${model!.weakestDay} (${model!.weakestDayTotal})',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
