import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/currency_conversion_record_model.dart';

class ConversionHistoryCard extends ConsumerWidget {
  final CurrencyConversionRecordModel item;

  const ConversionHistoryCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(
          '${item.inputAmount.toStringAsFixed(2)} ${item.fromCurrency} → ${item.outputAmount.toStringAsFixed(2)} ${item.toCurrency}',
        ),
        subtitle: Text('${i18n.t('Rate')}: ${item.rate.toStringAsFixed(4)}'),
        trailing: Text(item.createdAt.toIso8601String().split('T').first),
      ),
    );
  }
}