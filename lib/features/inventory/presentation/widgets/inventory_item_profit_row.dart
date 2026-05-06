import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';

class InventoryItemProfitRow extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Wrap(
      spacing: 12,
      runSpacing: 8,
      children: [
        Text(
          '${i18n.t('Cost')}: ${CurrencyFormatter.format(cost, currency: currency, decimals: 0)}',
        ),
        Text(
          '${i18n.t('Market Avg')}: ${CurrencyFormatter.format(marketAverage, currency: currency, decimals: 0)}',
        ),
        Text(
          '${i18n.t('Expected Profit')}: ${CurrencyFormatter.format(expectedProfit, currency: currency, decimals: 0)}',
        ),
        Text('${i18n.t('Days')}: $days'),
      ],
    );
  }
}