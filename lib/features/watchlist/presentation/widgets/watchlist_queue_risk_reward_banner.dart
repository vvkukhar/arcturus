import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_risk_reward_model.dart';

class WatchlistQueueRiskRewardBanner extends StatelessWidget {
  final WatchlistQueueRiskRewardModel model;

  const WatchlistQueueRiskRewardBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final positive = model.rewardGap > 0;
    final color = positive ? Colors.green : Colors.redAccent;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • gap ${model.rewardGap.toStringAsFixed(2)} • ${model.pressure}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}