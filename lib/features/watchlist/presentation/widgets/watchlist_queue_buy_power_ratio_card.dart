import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_model.dart';

class WatchlistQueueBuyPowerRatioCard extends StatelessWidget {
  final WatchlistQueueBuyPowerRatioModel model;

  const WatchlistQueueBuyPowerRatioCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final label = model.ratio <= 1
        ? 'within cash'
        : model.ratio <= 1.2
            ? 'tight'
            : 'overextended';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Expanded(
              child: Text(
                'Buy power ratio',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              '${model.ratio.toStringAsFixed(2)} • $label',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}