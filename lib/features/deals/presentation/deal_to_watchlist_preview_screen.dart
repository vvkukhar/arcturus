import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/deals/application/deal_to_watchlist_draft_model.dart';

class DealToWatchlistPreviewScreen extends StatelessWidget {
  final DealToWatchlistDraftModel draft;

  const DealToWatchlistPreviewScreen({
    super.key,
    required this.draft,
  });

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                color: Colors.white70,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Watchlist Draft Preview'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _row('Title', draft.title),
                  _row('Desired', draft.desiredBuyPrice.toStringAsFixed(2)),
                  _row('Max', draft.maxBuyPrice.toStringAsFixed(2)),
                  _row('Market', draft.marketPrice.toStringAsFixed(2)),
                  _row('Comment', draft.comment),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
