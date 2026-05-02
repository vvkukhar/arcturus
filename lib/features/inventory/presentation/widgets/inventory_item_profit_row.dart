import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';

class InventoryItemProfitRow extends StatelessWidget {
  final double cost;
  final double marketAverage;
  final double expectedProfit;
  final int days;
  final String currency;

  const InventoryItemProfitRow({
    super.key,
    required this.cost,
    required this.marketAverage,
    required this.expectedProfit,
    required this.days,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 8,
      children: [
        Text(
          'Cost: ${CurrencyFormatter.format(cost, currency: currency, decimals: 0)}',
        ),
        Text(
          'Market Avg: ${CurrencyFormatter.format(marketAverage, currency: currency, decimals: 0)}',
        ),
        Text(
          'Expected Profit: ${CurrencyFormatter.format(expectedProfit, currency: currency, decimals: 0)}',
        ),
        Text('Days: $days'),
      ],
    );
  }
}