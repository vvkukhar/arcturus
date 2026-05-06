import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/deals/application/deal_to_watchlist_draft_model.dart';

class DealToWatchlistPreviewScreen extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('draft.title')),
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
                  _row(i18n.t('draft.desired'), draft.desiredBuyPrice.toStringAsFixed(2)),
                  _row(i18n.t('draft.max'), draft.maxBuyPrice.toStringAsFixed(2)),
                  _row(i18n.t('eval.marketPrice'), draft.marketPrice.toStringAsFixed(2)),
                  _row(i18n.t('draft.comment'), draft.comment),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}