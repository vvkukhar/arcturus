import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

class MarketNoteActiveFilterChips extends StatelessWidget {
  final String query;
  final MarketNoteFilterModel filter;
  final VoidCallback onClearAll;

  const MarketNoteActiveFilterChips({
    super.key,
    required this.query,
    required this.filter,
    required this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    final chips = <Widget>[];

    if (query.trim().isNotEmpty) {
      chips.add(Chip(label: Text('Search: $query')));
    }

    if ((filter.snapshotIdContains ?? '').trim().isNotEmpty) {
      chips.add(Chip(label: Text('Snapshot: ${filter.snapshotIdContains}')));
    }

    if (filter.from != null) {
      chips.add(
        Chip(
          label: Text(
            'From: ${filter.from!.toIso8601String().split('T').first}',
          ),
        ),
      );
    }

    if (filter.to != null) {
      chips.add(
        Chip(
          label: Text(
            'To: ${filter.to!.toIso8601String().split('T').first}',
          ),
        ),
      );
    }

    if (chips.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: chips,
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: onClearAll,
                child: const Text('Clear filters'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}