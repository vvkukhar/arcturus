import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_breakdown_model.dart';

class WatchlistPriorityBreakdownCard extends StatelessWidget {
  final WatchlistPriorityBreakdownModel model;

  const WatchlistPriorityBreakdownCard({
    super.key,
    required this.model,
  });

  Widget _row(String label, double value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: Colors.white70),
            ),
          ),
          Text(
            value.toStringAsFixed(1),
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _row('Active boost', model.activeBoost),
          _row('Spread score', model.spreadScore),
          _row('Value gap score', model.valueGapScore),
          const Divider(),
          _row('Total', model.total),
        ],
      ),
    );
  }
}