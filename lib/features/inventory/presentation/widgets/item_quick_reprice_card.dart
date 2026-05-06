import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ItemQuickRepriceCard extends ConsumerWidget {
  final VoidCallback onMarket;
  final VoidCallback onMinus5;
  final VoidCallback onMinus10;
  final VoidCallback onPlus3;

  const ItemQuickRepriceCard({
    super.key,
    required this.onMarket,
    required this.onMinus5,
    required this.onMinus10,
    required this.onPlus3,
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
              onPressed: onMarket,
              child: Text(i18n.t('Set = Market')),
            ),
            FilledButton.tonal(
              onPressed: onMinus5,
              child: Text(i18n.t('Market -5%')),
            ),
            FilledButton.tonal(
              onPressed: onMinus10,
              child: Text(i18n.t('Market -10%')),
            ),
            FilledButton.tonal(
              onPressed: onPlus3,
              child: Text(i18n.t('Market +3%')),
            ),
          ],
        ),
      ),
    );
  }
}