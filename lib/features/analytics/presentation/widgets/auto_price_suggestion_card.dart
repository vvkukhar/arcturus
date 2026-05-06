import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_model.dart';

class AutoPriceSuggestionCard extends ConsumerWidget {
  final AutoPriceSuggestionModel model;
  final String currency;

  const AutoPriceSuggestionCard({
    super.key,
    required this.model,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(i18n.t(model.reason)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              CurrencyFormatter.format(model.suggestedPrice, currency: currency),
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            Text(
              '${i18n.t('now')} ${CurrencyFormatter.format(model.currentExpected, currency: currency)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}