import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_state.dart';

class CurrencyStatusCard extends ConsumerWidget {
  final CurrencyRateState state;

  const CurrencyStatusCard({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text('${i18n.t('Source')}: ${i18n.t(state.source.name)}'),
        subtitle: Text(
          state.error == null
              ? '${i18n.t('Rates')}: ${state.rates.length}'
              : '${i18n.t('common.error', {'error': state.error})}',
        ),
      ),
    );
  }
}