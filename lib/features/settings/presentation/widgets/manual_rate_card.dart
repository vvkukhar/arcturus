import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class ManualRateCard extends ConsumerWidget {
  final ManualCurrencyRateModel rate;

  const ManualRateCard({
    super.key,
    required this.rate,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(rate.code),
        subtitle: Text(
          '${i18n.t('Saved')}: ${rate.updatedAt.toIso8601String().split('T').first}',
        ),
        trailing: Text(
          rate.rateToUah.toStringAsFixed(4),
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}