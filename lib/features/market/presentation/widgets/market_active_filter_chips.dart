import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';

class MarketActiveFilterChips extends StatelessWidget {
  final String query;
  final MarketFilterModel filter;
  final VoidCallback onClearAll;

  const MarketActiveFilterChips({
    super.key,
    required this.query,
    required this.filter,
    required this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    final chips = <Widget>[];

    if (query.trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('search: $query'),
        ),
      );
    }

    if ((filter.sourceContains ?? '').trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('source: ${filter.sourceContains}'),
        ),
      );
    }

    if ((filter.itemTitleContains ?? '').trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('item: ${filter.itemTitleContains}'),
        ),
      );
    }

    if (filter.withUrlOnly) {
      chips.add(
        const Chip(
          label: Text('with url'),
        ),
      );
    }

    if (filter.positiveTrendOnly) {
      chips.add(
        const Chip(
          label: Text('positive trend'),
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