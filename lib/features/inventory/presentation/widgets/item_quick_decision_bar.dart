import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ItemQuickDecisionBar extends ConsumerWidget {
  final VoidCallback onSetMarket;
  final VoidCallback onMinus5;
  final VoidCallback onMoveNext;
  final VoidCallback onMovePrevious;

  const ItemQuickDecisionBar({
    super.key,
    required this.onSetMarket,
    required this.onMinus5,
    required this.onMoveNext,
    required this.onMovePrevious,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonal(
              onPressed: onSetMarket,
              child: Text(i18n.t('Set = Market')),
            ),
            FilledButton.tonal(
              onPressed: onMinus5,
              child: Text(i18n.t('Market -5%')),
            ),
            FilledButton.tonal(
              onPressed: onMovePrevious,
              child: Text(i18n.t('Prev Status')),
            ),
            FilledButton(
              onPressed: onMoveNext,
              child: Text(i18n.t('Next Status')),
            ),
          ],
        ),
      ),
    );
  }
}