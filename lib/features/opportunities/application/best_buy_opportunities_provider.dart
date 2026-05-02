import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_buy_opportunities_cached_provider.dart';

class BestBuyOpportunityModel {
  final String watchlistItemId;
  final String itemId;
  final String title;
  final double score;
  final String action;
  final String actionReasonPrimary;
  final String actionReasonSecondary;
  final double profit;
  final double roi;
  final double marginPercent;
  final double totalCostBasis;
  final double totalBuy;
  final double targetSellPrice;
  final String type;
  final String freshness;
  final String sourceCode;
  const BestBuyOpportunityModel({
    required this.watchlistItemId,
    required this.itemId,
    required this.title,
    required this.score,
    required this.action,
    required this.actionReasonPrimary,
    required this.actionReasonSecondary,
    required this.profit,
    required this.roi,
    required this.marginPercent,
    required this.totalCostBasis,
    required this.totalBuy,
    required this.targetSellPrice,
    required this.type,
    required this.freshness,
    required this.sourceCode,
  });
  factory BestBuyOpportunityModel.fromJson(Map<String, dynamic> json) {
    return BestBuyOpportunityModel(
      watchlistItemId: json['watchlistItemId'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0,
      action: json['action'] as String? ?? '',
      actionReasonPrimary: json['actionReasonPrimary'] as String? ?? '',
      actionReasonSecondary: json['actionReasonSecondary'] as String? ?? '',
      profit: (json['profit'] as num?)?.toDouble() ?? 0,
      roi: (json['roi'] as num?)?.toDouble() ?? 0,
      marginPercent: (json['marginPercent'] as num?)?.toDouble() ?? 0,
      totalCostBasis: (json['totalCostBasis'] as num?)?.toDouble() ?? 0,
      totalBuy: (json['totalBuy'] as num?)?.toDouble() ?? 0,
      targetSellPrice: (json['targetSellPrice'] as num?)?.toDouble() ?? 0,
      type: json['type'] as String? ?? '',
      freshness: json['freshness'] as String? ?? '',
      sourceCode: json['sourceCode'] as String? ?? '',
    );
  }
}

final bestBuyOpportunitiesProvider =
    FutureProvider<List<BestBuyOpportunityModel>>((ref) async {
  return ref.watch(bestBuyOpportunitiesCachedProvider.future);
});
