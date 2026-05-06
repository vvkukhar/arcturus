import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class BaseCurrencyCard extends ConsumerWidget {
  final String currency;

  const BaseCurrencyCard({
    super.key,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(i18n.t('Base Currency')),
        trailing: Text(
          currency,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}