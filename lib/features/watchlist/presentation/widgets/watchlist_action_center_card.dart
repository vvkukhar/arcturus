import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_action_center_provider.dart';

class WatchlistActionCenterCard extends StatelessWidget {
  final WatchlistActionCenterModel model;

  const WatchlistActionCenterCard({
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
            const Text(
              'Watchlist Action Center',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Ready ${model.readyToBuy}')),
                Chip(label: Text('Wait ${model.wait}')),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              model.topAction,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}