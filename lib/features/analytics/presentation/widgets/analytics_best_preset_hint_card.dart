import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_best_preset_hint_model.dart';

class AnalyticsBestPresetHintCard extends StatelessWidget {
  final AnalyticsBestPresetHintModel model;

  const AnalyticsBestPresetHintCard({
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
              'Preset hint: ${model.title}',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(model.reason),
          ],
        ),
      ),
    );
  }
}
