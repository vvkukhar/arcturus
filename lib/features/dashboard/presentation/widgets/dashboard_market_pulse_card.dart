import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_market_pulse_provider.dart';

class DashboardMarketPulseCard extends StatelessWidget {
  final DashboardMarketPulseModel model;
  final VoidCallback onOpenBuy;
  final VoidCallback onOpenSell;
  final VoidCallback onOpenReprice;
  final VoidCallback onOpenReview;

  const DashboardMarketPulseCard({
    super.key,
    required this.model,
    required this.onOpenBuy,
    required this.onOpenSell,
    required this.onOpenReprice,
    required this.onOpenReview,
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
            const SizedBox(height: 10),
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
                FilledButton.tonal(
                  onPressed: onOpenReprice,
                  child: Text('Reprice ${model.repriceCount}'),
                ),
                FilledButton.tonal(
                  onPressed: onOpenReview,
                  child: Text('Review ${model.reviewCount}'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}