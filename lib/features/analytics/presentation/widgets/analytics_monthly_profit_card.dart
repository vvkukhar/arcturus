import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_monthly_profit_model.dart';

class AnalyticsMonthlyProfitCard extends ConsumerWidget {
  final AnalyticsMonthlyProfitModel model;
  final String currency;

  const AnalyticsMonthlyProfitCard({
    super.key,
    required this.model,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(model.label),
        subtitle: Text(
          '${i18n.t('Revenue')}: ${CurrencyFormatter.format(model.revenue, currency: currency)} | '
          '${i18n.t('Net')}: ${CurrencyFormatter.format(model.netProfit, currency: currency)}',
        ),
        trailing: Text(
          model.salesCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}