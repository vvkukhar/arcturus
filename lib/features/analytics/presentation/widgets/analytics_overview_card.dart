import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AnalyticsOverviewCard extends ConsumerWidget {
  final int soldCount;
  final int activeCount;
  final int deadStockCount;

  const AnalyticsOverviewCard({
    super.key,
    required this.soldCount,
    required this.activeCount,
    required this.deadStockCount,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row(i18n.t('Sold count'), soldCount.toString()),
            const SizedBox(height: 8),
            _row(i18n.t('Active count'), activeCount.toString()),
            const SizedBox(height: 8),
            _row(i18n.t('Dead stock count'), deadStockCount.toString()),
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value) {
    return Row(
      children: [
        Expanded(child: Text(label)),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ],
    );
  }
}