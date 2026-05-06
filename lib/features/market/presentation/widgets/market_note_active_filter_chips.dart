import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

class MarketNoteActiveFilterChips extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final chips = <Widget>[];

    if (query.trim().isNotEmpty) {
      chips.add(Chip(label: Text('${i18n.t('Search')}: $query')));
    }

    if ((filter.snapshotIdContains ?? '').trim().isNotEmpty) {
      chips.add(Chip(label: Text('${i18n.t('Snapshot')}: ${filter.snapshotIdContains}')));
    }

    if (filter.from != null) {
      chips.add(
        Chip(
          label: Text(
            '${i18n.t('From')}: ${filter.from!.toIso8601String().split('T').first}',
          ),
        ),
      );
    }

    if (filter.to != null) {
      chips.add(
        Chip(
          label: Text(
            '${i18n.t('To')}: ${filter.to!.toIso8601String().split('T').first}',
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
                child: Text(i18n.t('Clear filters')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}