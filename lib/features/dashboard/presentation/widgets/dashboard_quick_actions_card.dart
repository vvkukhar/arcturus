import 'package:flutter/material.dart';

class DashboardQuickActionsCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton(
              onPressed: onInventory,
              child: const Text('Inventory'),
            ),
            FilledButton(
              onPressed: onPurchases,
              child: const Text('Purchases'),
            ),
            FilledButton(
              onPressed: onSales,
              child: const Text('Sales'),
            ),
            FilledButton(
              onPressed: onWatchlist,
              child: const Text('Watchlist'),
            ),
            FilledButton(
              onPressed: onAnalytics,
              child: const Text('Analytics'),
            ),
            FilledButton(
              onPressed: onMarket,
              child: const Text('Market'),
            ),
            FilledButton(
              onPressed: onPartOut,
              child: const Text('Part-out'),
            ),
          ],
        ),
      ),
    );
  }
}
