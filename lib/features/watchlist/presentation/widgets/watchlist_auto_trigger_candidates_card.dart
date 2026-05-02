import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_trigger_candidate_model.dart';

class WatchlistAutoTriggerCandidatesCard extends StatelessWidget {
  final List<WatchlistAutoTriggerCandidateModel> items;

  const WatchlistAutoTriggerCandidatesCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text('No auto-trigger candidates right now.'),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Auto-trigger buy candidates',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${item.title} • market ${item.marketPrice.toStringAsFixed(2)} / target ${item.desiredPrice.toStringAsFixed(2)}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
