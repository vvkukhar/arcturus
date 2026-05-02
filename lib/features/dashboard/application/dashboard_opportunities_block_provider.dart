import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_buy_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_sell_opportunities_provider.dart';

class DashboardOpportunitiesBlockModel {
  final int buyCount;
  final int sellCount;
  final String headline;
  final String subline;

  const DashboardOpportunitiesBlockModel({
    required this.buyCount,
    required this.sellCount,
    required this.headline,
    required this.subline,
  });
}

final dashboardOpportunitiesBlockProvider =
    FutureProvider<DashboardOpportunitiesBlockModel>((ref) async {
  final buy = await ref.watch(bestBuyOpportunitiesProvider.future);
  final sell = await ref.watch(bestSellOpportunitiesProvider.future);

  final headline = buy.isNotEmpty
      ? 'Live opportunities found'
      : sell.isNotEmpty
          ? 'Sell opportunities found'
          : 'No strong opportunities yet';
  final subline = 'Buy ${buy.length} • Sell ${sell.length}';

  return DashboardOpportunitiesBlockModel(
    buyCount: buy.length,
    sellCount: sell.length,
    headline: headline,
    subline: subline,
  );
});
