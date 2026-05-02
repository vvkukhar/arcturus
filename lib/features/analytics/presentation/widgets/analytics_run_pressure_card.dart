import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_pressure_model.dart';

class AnalyticsRunPressureCard extends StatelessWidget {
  final AnalyticsRunPressureModel model;

  const AnalyticsRunPressureCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.totalRuns == 0
        ? Colors.grey
        : model.totalRuns <= 5
            ? Colors.blue
            : model.totalRuns <= 12
                ? Colors.orange
                : Colors.redAccent;

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
              '${model.totalRuns} / ${model.affectedItems}',
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
