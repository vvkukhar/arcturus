import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_theme_profit_provider.dart';

class AnalyticsThemeProfitCard extends ConsumerWidget {
  final AnalyticsThemeProfitEntry entry;
  final String currency;

  const AnalyticsThemeProfitCard({
    super.key,
    required this.entry,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(entry.theme),
        subtitle: Text('${i18n.t('Items:')} ${entry.count}'),
        trailing: Text(
          CurrencyFormatter.format(entry.expectedProfit, currency: currency),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}