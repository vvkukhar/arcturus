import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_band_model.dart';

final analyticsProfitBandsProvider =
    Provider<List<AnalyticsProfitBandModel>>((ref) {
  final sold = ref.watch(inventoryRepositoryProvider).getSoldItems();

  int negative = 0;
  int zeroTo500 = 0;
  int p500To2000 = 0;
  int gt2000 = 0;

  for (final item in sold) {
    final profit = (item.actualSalePrice ?? 0) - item.totalCost;
    if (profit < 0) {
      negative++;
    } else if (profit <= 500) {
      zeroTo500++;
    } else if (profit <= 2000) {
      p500To2000++;
    } else {
      gt2000++;
    }
  }

  return [
    AnalyticsProfitBandModel(label: 'Loss', count: negative),
    AnalyticsProfitBandModel(label: '0-500', count: zeroTo500),
    AnalyticsProfitBandModel(label: '500-2000', count: p500To2000),
    AnalyticsProfitBandModel(label: '> 2000', count: gt2000),
  ];
});