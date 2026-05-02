import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_opportunities_block_provider.dart';

class DashboardOpportunitiesBlockCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.headline,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(model.subline),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                FilledButton(
                  onPressed: onOpenBuy,
                  child: Text('Buy ${model.buyCount}'),
                ),
                FilledButton.tonal(
                  onPressed: onOpenSell,
                  child: Text('Sell ${model.sellCount}'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
