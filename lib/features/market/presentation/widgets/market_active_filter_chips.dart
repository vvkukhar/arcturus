import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';

class MarketActiveFilterChips extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final chips = <Widget>[];

    if (query.trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('${i18n.t('search')}: $query'),
        ),
      );
    }

    if ((filter.sourceContains ?? '').trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('${i18n.t('source')}: ${filter.sourceContains}'),
        ),
      );
    }

    if ((filter.itemTitleContains ?? '').trim().isNotEmpty) {
      chips.add(
        Chip(
          label: Text('${i18n.t('item')}: ${filter.itemTitleContains}'),
        ),
      );
    }

    if (filter.withUrlOnly) {
      chips.add(
        Chip(
          label: Text(i18n.t('with url')),
        ),
      );
    }

    if (filter.positiveTrendOnly) {
      chips.add(
        Chip(
          label: Text(i18n.t('positive trend')),
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