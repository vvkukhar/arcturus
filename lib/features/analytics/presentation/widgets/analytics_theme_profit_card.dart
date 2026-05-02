// lib/features/analytics/presentation/widgets/analytics_theme_profit_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_theme_profit_provider.dart';

class AnalyticsThemeProfitCard extends StatelessWidget {
  final AnalyticsThemeProfitEntry entry;
  final String currency;

  const AnalyticsThemeProfitCard({
    super.key,
    required this.entry,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.theme),
        subtitle: Text('Items: ${entry.count}'),
        trailing: Text(
          CurrencyFormatter.format(entry.expectedProfit, currency: currency),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
