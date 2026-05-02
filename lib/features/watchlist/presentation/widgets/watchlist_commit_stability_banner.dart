import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_model.dart';

class WatchlistCommitStabilityBanner extends StatelessWidget {
  final WatchlistCommitStabilityModel model;

  const WatchlistCommitStabilityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.score >= 75
        ? Colors.green
        : model.score >= 50
            ? Colors.orange
            : Colors.redAccent;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.score.toStringAsFixed(0)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
