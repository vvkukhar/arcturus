import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_sell_opportunities_cached_provider.dart';

class BestSellOpportunityModel {
  final String inventoryItemId;
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
  final double targetSellPrice;
  final double confidenceScore;
  const BestSellOpportunityModel({
    required this.inventoryItemId,
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
    required this.targetSellPrice,
    required this.confidenceScore,
  });
  factory BestSellOpportunityModel.fromJson(Map<String, dynamic> json) {
    return BestSellOpportunityModel(
      inventoryItemId: json['inventoryItemId'] as String? ?? '',
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
      targetSellPrice: (json['targetSellPrice'] as num?)?.toDouble() ?? 0,
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble() ?? 0,
    );
  }
}

final bestSellOpportunitiesProvider =
    FutureProvider<List<BestSellOpportunityModel>>((ref) async {
  return ref.watch(bestSellOpportunitiesCachedProvider.future);
});
