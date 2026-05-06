import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PurchasesAverageCard extends ConsumerWidget {
  final double averagePurchase;
  final double averageShipping;
  final String currency;

  const PurchasesAverageCard({
    super.key,
    required this.averagePurchase,
    required this.averageShipping,
    required this.currency,
  });

  Widget _row(String label, double value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            '${value.toStringAsFixed(2)} $currency',
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            _row(i18n.t('Average purchase'), averagePurchase),
            _row(i18n.t('Average shipping'), averageShipping),
          ],
        ),
      ),
    );
  }
}