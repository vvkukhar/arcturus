import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_done_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_flow_provider.dart';

class DashboardFlowCountersModel {
  final int purchaseFlow;
  final int repriceFlow;
  final int reviewDone;
  final String headline;

  const DashboardFlowCountersModel({
    required this.purchaseFlow,
    required this.repriceFlow,
    required this.reviewDone,
    required this.headline,
  });
}

final dashboardFlowCountersProvider =
    Provider<DashboardFlowCountersModel>((ref) {
  final purchaseFlow = ref.watch(watchlistPurchaseFlowProvider);
  final repriceFlow = ref.watch(inventoryRepriceFlowProvider);
  final reviewDone = ref.watch(inventoryReviewDoneProvider);
  final headline = purchaseFlow.isNotEmpty
      ? 'Purchase flow has active items'
      : repriceFlow.isNotEmpty
          ? 'Reprice flow has active items'
          : reviewDone.isNotEmpty
              ? 'Some review items are completed'
              : 'No active flow pressure';
  return DashboardFlowCountersModel(
    purchaseFlow: purchaseFlow.length,
    repriceFlow: repriceFlow.length,
    reviewDone: reviewDone.length,
    headline: headline,
  );
});
