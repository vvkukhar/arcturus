import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository_provider.dart';

class ProfitabilityBreakdownModel {
  final String itemId;
  final String contextId;
  final String contextType;
  final String title;
  final double buyPrice;
  final double shippingCost;
  final double platformFeeRate;
  final double paymentFeeRate;
  final double packagingCost;
  final double targetSellPrice;
  final double totalEntryCost;
  final double grossRevenue;
  final double totalFees;
  final double netRevenue;
  final double netProfit;
  final double roiPercent;

  const ProfitabilityBreakdownModel({
    required this.itemId,
    required this.contextId,
    required this.contextType,
    required this.title,
    required this.buyPrice,
    required this.shippingCost,
    required this.platformFeeRate,
    required this.paymentFeeRate,
    required this.packagingCost,
    required this.targetSellPrice,
    required this.totalEntryCost,
    required this.grossRevenue,
    required this.totalFees,
    required this.netRevenue,
    required this.netProfit,
    required this.roiPercent,
  });

  factory ProfitabilityBreakdownModel.fromJson(Map<String, dynamic> json) {
    return ProfitabilityBreakdownModel(
      itemId: json['itemId'] as String? ?? '',
      contextId: json['contextId'] as String? ?? '',
      contextType: json['contextType'] as String? ?? '',
      title: json['title'] as String? ?? '',
      buyPrice: (json['buyPrice'] as num?)?.toDouble() ?? 0,
      shippingCost: (json['shippingCost'] as num?)?.toDouble() ?? 0,
      platformFeeRate: (json['platformFeeRate'] as num?)?.toDouble() ?? 0,
      paymentFeeRate: (json['paymentFeeRate'] as num?)?.toDouble() ?? 0,
      packagingCost: (json['packagingCost'] as num?)?.toDouble() ?? 0,
      targetSellPrice: (json['targetSellPrice'] as num?)?.toDouble() ?? 0,
      totalEntryCost: (json['totalEntryCost'] as num?)?.toDouble() ?? 0,
      grossRevenue: (json['grossRevenue'] as num?)?.toDouble() ?? 0,
      totalFees: (json['totalFees'] as num?)?.toDouble() ?? 0,
      netRevenue: (json['netRevenue'] as num?)?.toDouble() ?? 0,
      netProfit: (json['netProfit'] as num?)?.toDouble() ?? 0,
      roiPercent: (json['roiPercent'] as num?)?.toDouble() ?? 0,
    );
  }
}

final profitabilityBreakdownProvider = FutureProvider.family.autoDispose<
    ProfitabilityBreakdownModel?, ({String contextType, String contextId})>(
  (ref, input) async {
    final repository = ref.watch(opportunitiesApiRepositoryProvider);
    final json = await repository.getProfitabilityBreakdown(
      contextType: input.contextType,
      contextId: input.contextId,
    );
    if (json == null) return null;
    return ProfitabilityBreakdownModel.fromJson(json);
  },
);
