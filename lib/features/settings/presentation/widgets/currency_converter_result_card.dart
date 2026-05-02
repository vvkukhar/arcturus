import 'package:flutter/material.dart';

class CurrencyConverterResultCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _Row(label: 'From', value: '$inputAmount $fromCurrency'),
            _Row(label: 'Rate', value: rate.toStringAsFixed(4)),
            _Row(
              label: 'To',
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