// lib/features/market/presentation/widgets/market_trend_deep_card.dart
import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_trend_deep_model.dart';

class MarketTrendDeepCard extends StatelessWidget {
  final MarketTrendDeepModel model;

  const MarketTrendDeepCard({
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
              model.itemTitle,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('Low: ${model.low.toStringAsFixed(2)}'),
                Text('Avg: ${model.average.toStringAsFixed(2)}'),
                Text('High: ${model.high.toStringAsFixed(2)}'),
                Text('Spread: ${model.spread.toStringAsFixed(2)}'),
                Text('Snapshots: ${model.snapshots}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
