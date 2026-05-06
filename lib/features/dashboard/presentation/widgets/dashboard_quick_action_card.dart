import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DashboardQuickActionsCard extends ConsumerWidget {
  final VoidCallback onInventory;
  final VoidCallback onPurchases;
  final VoidCallback onSales;
  final VoidCallback onWatchlist;
  final VoidCallback onAnalytics;
  final VoidCallback onMarket;
  final VoidCallback onPartOut;

  const DashboardQuickActionsCard({
    super.key,
    required this.onInventory,
    required this.onPurchases,
    required this.onSales,
    required this.onWatchlist,
    required this.onAnalytics,
    required this.onMarket,
    required this.onPartOut,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton(
              onPressed: onInventory,
              child: Text(i18n.t('drawer.inventory')),
            ),
            FilledButton(
              onPressed: onPurchases,
              child: Text(i18n.t('drawer.purchases')),
            ),
            FilledButton(
              onPressed: onSales,
              child: Text(i18n.t('drawer.sales')),
            ),
            FilledButton(
              onPressed: onWatchlist,
              child: Text(i18n.t('drawer.watchlist')),
            ),
            FilledButton(
              onPressed: onAnalytics,
              child: Text(i18n.t('analytics.title')),
            ),
            FilledButton(
              onPressed: onMarket,
              child: Text(i18n.t('market.title')),
            ),
            FilledButton(
              onPressed: onPartOut,
              child: Text(i18n.t('partout.title')),
            ),
          ],
        ),
      ),
    );
  }
}