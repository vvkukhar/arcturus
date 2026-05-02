import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_summary_model.dart';

class WatchlistOpportunitySummaryCard extends StatelessWidget {
  final WatchlistOpportunitySummaryModel summary;

  const WatchlistOpportunitySummaryCard({
    super.key,
    required this.summary,
  });

  @override
  Widget build(BuildContext context) {
    Widget row(String label, String value, Color? color) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            row(
              'Target hit',
              summary.underDesiredCount.toString(),
              Colors.green,
            ),
            row(
              'Acceptable',
              summary.underMaxCount.toString(),
              Colors.orange,
            ),
            row(
              'Too high',
              summary.tooHighCount.toString(),
              Colors.redAccent,
            ),
          ],
        ),
      ),
    );
  }
}