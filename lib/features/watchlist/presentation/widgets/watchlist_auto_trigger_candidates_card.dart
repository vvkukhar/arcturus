import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_trigger_candidate_model.dart';

class WatchlistAutoTriggerCandidatesCard extends ConsumerWidget {
  final List<WatchlistAutoTriggerCandidateModel> items;

  const WatchlistAutoTriggerCandidatesCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Text(i18n.t('No auto-trigger candidates right now.')),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Auto-trigger buy candidates'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${item.title} • ${i18n.t('market')} ${item.marketPrice.toStringAsFixed(2)} / ${i18n.t('target')} ${item.desiredPrice.toStringAsFixed(2)}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}