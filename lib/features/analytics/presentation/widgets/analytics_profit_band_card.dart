import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_band_model.dart';

class AnalyticsProfitBandCard extends StatelessWidget {
  final AnalyticsProfitBandModel band;

  const AnalyticsProfitBandCard({
    super.key,
    required this.band,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(band.label),
        trailing: Text(
          band.count.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
