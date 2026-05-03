import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_readiness_model.dart';

class AnalyticsStackReadinessCard extends StatelessWidget {
  final AnalyticsStackReadinessModel model;

  const AnalyticsStackReadinessCard({
    super.key,
    required this.model,
  });

  Color _color() {
    if (model.score >= 80) return Colors.green;
    if (model.score >= 55) return Colors.orange;
    return Colors.redAccent;
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                model.score.toStringAsFixed(0),
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}