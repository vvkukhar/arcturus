// lib/features/analytics/presentation/widgets/flip_score_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_model.dart';

class FlipScoreCard extends StatelessWidget {
  final FlipScoreModel model;

  const FlipScoreCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(
          'Expected profit: ${model.expectedProfit.toStringAsFixed(2)} | '
          'Days: ${model.daysInInventory}',
        ),
        trailing: Text(
          model.score.toStringAsFixed(1),
          style: const TextStyle(
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}
