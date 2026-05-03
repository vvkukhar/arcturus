import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_buy_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_reprice_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_review_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_sell_opportunities_provider.dart';

class DashboardMarketPulseModel {
  final int buyCount;
  final int sellCount;
  final int repriceCount;
  final int reviewCount;
  final String headline;

  const DashboardMarketPulseModel({
    required this.buyCount,
    required this.sellCount,
    required this.repriceCount,
    required this.reviewCount,
    required this.headline,
  });
}

final dashboardMarketPulseProvider = FutureProvider<DashboardMarketPulseModel>((ref) async {
  final buy = await ref.watch(bestBuyOpportunitiesProvider.future);
  final sell = await ref.watch(bestSellOpportunitiesProvider.future);
  final reprice = await ref.watch(bestRepriceOpportunitiesProvider.future);
  final review = await ref.watch(bestReviewOpportunitiesProvider.future);

  final headline = buy.isNotEmpty
      ? 'Buy market is active'
      : sell.isNotEmpty
          ? 'Sell market is active'
          : reprice.isNotEmpty
              ? 'Reprice market is active'
              : review.isNotEmpty
                  ? 'Review pressure exists'
                  : 'Market pulse is calm';

  return DashboardMarketPulseModel(
    buyCount: buy.length,
    sellCount: sell.length,
    repriceCount: reprice.length,
    reviewCount: review.length,
    headline: headline,
  );
});