import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_strip_model.dart';

class DashboardKpiStripCard extends StatelessWidget {
  final DashboardKpiStripModel model;
  final String currency;

  const DashboardKpiStripCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Widget _tile({
    required String title,
    required String value,
  }) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            _tile(
              title: 'Liquidation Potential',
              value: CurrencyFormatter.format(
                model.liquidationPotential,
                currency: currency,
                decimals: 0,
              ),
            ),
            const SizedBox(width: 12),
            _tile(
              title: 'Open Expected Profit',
              value: CurrencyFormatter.format(
                model.expectedOpenProfit,
                currency: currency,
                decimals: 0,
              ),
            ),
            const SizedBox(width: 12),
            _tile(
              title: 'Watchlist Hits',
              value: model.watchlistHits.toString(),
            ),
          ],
        ),
      ),
    );
  }
}
