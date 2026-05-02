import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_model.dart';

class WatchlistOpportunityCard extends StatelessWidget {
  final WatchlistOpportunityModel item;
  final String currency;

  const WatchlistOpportunityCard({
    super.key,
    required this.item,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    final color = item.underDesired
        ? Colors.green
        : item.underMax
            ? Colors.orange
            : Colors.redAccent;

    final label = item.underDesired
        ? 'target hit'
        : item.underMax
            ? 'acceptable'
            : 'too high';

    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(
          'Market: ${CurrencyFormatter.format(item.marketPrice, currency: currency, decimals: 0)} | '
          'Desired: ${CurrencyFormatter.format(item.desiredBuyPrice, currency: currency, decimals: 0)} | '
          'Max: ${CurrencyFormatter.format(item.maxBuyPrice, currency: currency, decimals: 0)}',
        ),
        trailing: Text(
          label,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}