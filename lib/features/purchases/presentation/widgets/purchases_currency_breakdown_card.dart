import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_currency_breakdown_provider.dart';

class PurchasesCurrencyBreakdownCard extends ConsumerWidget {
  final List<PurchasesCurrencyBreakdownModel> items;

  const PurchasesCurrencyBreakdownCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Currency Breakdown'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: items.map((item) {
                return Chip(
                  label: Text(
                    '${item.currency}: ${item.count} • ${item.totalSpend.toStringAsFixed(2)}',
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}