import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class CurrencyConverterResultCard extends ConsumerWidget {
  final String fromCurrency;
  final String toCurrency;
  final double inputAmount;
  final double rate;
  final double outputAmount;

  const CurrencyConverterResultCard({
    super.key,
    required this.fromCurrency,
    required this.toCurrency,
    required this.inputAmount,
    required this.rate,
    required this.outputAmount,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _Row(label: i18n.t('From'), value: '$inputAmount $fromCurrency'),
            _Row(label: i18n.t('Rate'), value: rate.toStringAsFixed(4)),
            _Row(
              label: i18n.t('To'),
              value: '${outputAmount.toStringAsFixed(2)} $toCurrency',
            ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;

  const _Row({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}