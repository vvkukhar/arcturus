// lib/features/analytics/presentation/widgets/auto_price_suggestion_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_model.dart';

class AutoPriceSuggestionCard extends StatelessWidget {
  final AutoPriceSuggestionModel model;
  final String currency;

  const AutoPriceSuggestionCard({
    super.key,
    required this.model,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(model.reason),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              CurrencyFormatter.format(model.suggestedPrice,
                  currency: currency),
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            Text(
              'now ${CurrencyFormatter.format(model.currentExpected, currency: currency)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
