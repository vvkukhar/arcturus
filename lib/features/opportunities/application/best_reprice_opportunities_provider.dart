import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository_provider.dart';

class BestRepriceOpportunityModel {
  final String inventoryItemId;
  final String itemId;
  final String title;
  final double repriceScore;
  final double currentExpectedPrice;
  final double suggestedPrice;
  final double medianMarketPrice;
  final double deltaToMedian;
  final String reason;

  const BestRepriceOpportunityModel({
    required this.inventoryItemId,
    required this.itemId,
    required this.title,
    required this.repriceScore,
    required this.currentExpectedPrice,
    required this.suggestedPrice,
    required this.medianMarketPrice,
    required this.deltaToMedian,
    required this.reason,
  });

  factory BestRepriceOpportunityModel.fromJson(Map<String, dynamic> json) {
    return BestRepriceOpportunityModel(
      inventoryItemId: json['inventoryItemId'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      repriceScore: (json['repriceScore'] as num?)?.toDouble() ?? 0,
      currentExpectedPrice:
          (json['currentExpectedPrice'] as num?)?.toDouble() ?? 0,
      suggestedPrice: (json['suggestedPrice'] as num?)?.toDouble() ?? 0,
      medianMarketPrice: (json['medianMarketPrice'] as num?)?.toDouble() ?? 0,
      deltaToMedian: (json['deltaToMedian'] as num?)?.toDouble() ?? 0,
      reason: json['reason'] as String? ?? '',
    );
  }
}

final bestRepriceOpportunitiesProvider =
    FutureProvider<List<BestRepriceOpportunityModel>>((ref) async {
  final repository = ref.watch(opportunitiesApiRepositoryProvider);
  final json = await repository.getBestRepriceOpportunities();
  return json.map(BestRepriceOpportunityModel.fromJson).toList();
});
