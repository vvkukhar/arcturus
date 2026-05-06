import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_opportunities_block_provider.dart';

class DashboardOpportunitiesBlockCard extends ConsumerWidget {
  final DashboardOpportunitiesBlockModel model;
  final VoidCallback onOpenBuy;
  final VoidCallback onOpenSell;

  const DashboardOpportunitiesBlockCard({
    super.key,
    required this.model,
    required this.onOpenBuy,
    required this.onOpenSell,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(model.headline),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(i18n.t(model.subline)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                FilledButton(
                  onPressed: onOpenBuy,
                  child: Text('${i18n.t('Buy')} ${model.buyCount}'),
                ),
                FilledButton.tonal(
                  onPressed: onOpenSell,
                  child: Text('${i18n.t('Sell')} ${model.sellCount}'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}