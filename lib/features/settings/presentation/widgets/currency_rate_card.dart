import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyRateCard extends ConsumerWidget {
  final CurrencyRateModel rate;

  const CurrencyRateCard({
    super.key,
    required this.rate,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text('${rate.code} — ${rate.name}'),
        subtitle: Text('${i18n.t('Base')}: ${rate.baseCurrency}'),
        trailing: Text(
          rate.rate.toStringAsFixed(4),
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}