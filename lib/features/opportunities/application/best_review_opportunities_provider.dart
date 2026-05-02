import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository_provider.dart';

class BestReviewOpportunityModel {
  final String inventoryItemId;
  final String itemId;
  final String title;
  final double reviewScore;
  final double totalCost;
  final double expectedSalePrice;
  final double medianMarketPrice;
  final double marginGap;
  final String reason;

  const BestReviewOpportunityModel({
    required this.inventoryItemId,
    required this.itemId,
    required this.title,
    required this.reviewScore,
    required this.totalCost,
    required this.expectedSalePrice,
    required this.medianMarketPrice,
    required this.marginGap,
    required this.reason,
  });

  factory BestReviewOpportunityModel.fromJson(Map<String, dynamic> json) {
    return BestReviewOpportunityModel(
      inventoryItemId: json['inventoryItemId'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      reviewScore: (json['reviewScore'] as num?)?.toDouble() ?? 0,
      totalCost: (json['totalCost'] as num?)?.toDouble() ?? 0,
      expectedSalePrice: (json['expectedSalePrice'] as num?)?.toDouble() ?? 0,
      medianMarketPrice: (json['medianMarketPrice'] as num?)?.toDouble() ?? 0,
      marginGap: (json['marginGap'] as num?)?.toDouble() ?? 0,
      reason: json['reason'] as String? ?? '',
    );
  }
}

final bestReviewOpportunitiesProvider =
    FutureProvider<List<BestReviewOpportunityModel>>((ref) async {
  final repository = ref.watch(opportunitiesApiRepositoryProvider);
  final json = await repository.getBestReviewOpportunities();
  return json.map(BestReviewOpportunityModel.fromJson).toList();
});
