import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_band_model.dart';

class AnalyticsProfitBandCard extends ConsumerWidget {
  final AnalyticsProfitBandModel band;

  const AnalyticsProfitBandCard({
    super.key,
    required this.band,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(i18n.t(band.label)),
        trailing: Text(
          band.count.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}