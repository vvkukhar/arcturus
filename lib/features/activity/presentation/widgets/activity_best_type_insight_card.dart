import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_best_type_insight_model.dart';

class ActivityBestTypeInsightCard extends StatelessWidget {
  final ActivityBestTypeInsightModel? model;

  const ActivityBestTypeInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Chip(
          label: Text('Top type: ${model!.topType} (${model!.count})'),
        ),
      ),
    );
  }
}
