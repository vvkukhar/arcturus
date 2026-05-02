import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_score_model.dart';

class DeadStockScoreCard extends StatelessWidget {
  final DeadStockScoreModel model;

  const DeadStockScoreCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(
          'Days: ${model.days} | Capital: ${model.capital.toStringAsFixed(0)} | '
          'Expected: ${model.expectedProfit.toStringAsFixed(0)}',
        ),
        trailing: Text(
          model.score.toStringAsFixed(1),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}