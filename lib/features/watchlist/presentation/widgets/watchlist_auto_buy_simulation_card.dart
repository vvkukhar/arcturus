import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_model.dart';

class WatchlistAutoBuySimulationCard extends StatelessWidget {
  final WatchlistAutoBuySimulationModel model;

  const WatchlistAutoBuySimulationCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell('Candidates', model.totalCandidates.toString()),
                _cell('Spend', model.totalSpend.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                    'Target value', model.totalTargetValue.toStringAsFixed(2)),
                _cell(
                  'Estimated spread',
                  model.estimatedSpread.toStringAsFixed(2),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
