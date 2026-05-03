import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_cash_warning_model.dart';

class WatchlistQueueCashWarningCard extends StatelessWidget {
  final WatchlistQueueCashWarningModel model;

  const WatchlistQueueCashWarningCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (!model.hasWarning) {
      return const SizedBox.shrink();
    }

    return Card(
      color: Colors.redAccent.withValues(alpha: 0.1),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Icon(Icons.warning_amber_outlined, color: Colors.redAccent),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Warning: Cash shortage of ${model.shortage.toStringAsFixed(2)}',
                style: const TextStyle(
                  color: Colors.redAccent,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}