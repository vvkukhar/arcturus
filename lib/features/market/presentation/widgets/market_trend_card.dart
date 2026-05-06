import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/market/application/market_trend_model.dart';

class MarketTrendCard extends ConsumerWidget {
  final MarketTrendModel trend;
  final String currency;

  const MarketTrendCard({
    super.key,
    required this.trend,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryRepository = ref.read(inventoryRepositoryProvider);
    final itemTitle =
        inventoryRepository.getById(trend.itemRef)?.title ?? trend.itemRef;
    final isUp = trend.delta >= 0;
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(itemTitle),
        subtitle: Text(
          '${i18n.t('Prev')}: ${CurrencyFormatter.format(trend.previousAverage, currency: currency)} → '
          '${i18n.t('Now')}: ${CurrencyFormatter.format(trend.latestAverage, currency: currency)}',
        ),
        trailing: Text(
          '${isUp ? '+' : ''}${trend.delta.toStringAsFixed(2)}',
          style: TextStyle(
            color: isUp ? Colors.green : Colors.redAccent,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}