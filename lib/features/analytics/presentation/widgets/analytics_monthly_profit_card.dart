// lib/features/analytics/presentation/widgets/analytics_monthly_profit_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_monthly_profit_provider.dart';

class AnalyticsMonthlyProfitCard extends StatelessWidget {
  final AnalyticsMonthlyProfitModel model;
  final String currency;

  const AnalyticsMonthlyProfitCard({
    super.key,
    required this.model,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(model.label),
        subtitle: Text(
          'Revenue: ${CurrencyFormatter.format(model.revenue, currency: currency)} | '
          'Net: ${CurrencyFormatter.format(model.netProfit, currency: currency)}',
        ),
        trailing: Text(
          model.salesCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
