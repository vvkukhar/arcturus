import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/review_flow_provider.dart';

class DashboardExecutionSummaryModel {
  final int purchasePending;
  final int purchaseBought;
  final int repricePending;
  final int repriceListed;
  final int reviewPending;
  final int reviewDone;
  final String headline;

  const DashboardExecutionSummaryModel({
    required this.purchasePending,
    required this.purchaseBought,
    required this.repricePending,
    required this.repriceListed,
    required this.reviewPending,
    required this.reviewDone,
    required this.headline,
  });
}

final dashboardExecutionSummaryProvider =
    FutureProvider<DashboardExecutionSummaryModel>((ref) async {
  final purchase = await ref.watch(purchaseFlowProvider.future);
  final reprice = await ref.watch(repriceFlowProvider.future);
  final review = await ref.watch(reviewFlowProvider.future);

  final purchasePending =
      purchase.where((item) => item.status == 'pending').length;
  final purchaseBought =
      purchase.where((item) => item.status == 'bought').length;
  final repricePending =
      reprice.where((item) => item.status == 'pending').length;
  final repriceListed = reprice.where((item) => item.status == 'listed').length;
  final reviewPending = review.where((item) => item.status == 'pending').length;
  final reviewDone = review.where((item) => item.status == 'reviewed').length;

  final headline = purchasePending > 0
      ? 'Execution queue is active'
      : repricePending > 0
          ? 'Repricing queue is active'
          : reviewPending > 0
              ? 'Review queue is active'
              : 'Execution is under control';

  return DashboardExecutionSummaryModel(
    purchasePending: purchasePending,
    purchaseBought: purchaseBought,
    repricePending: repricePending,
    repriceListed: repriceListed,
    reviewPending: reviewPending,
    reviewDone: reviewDone,
    headline: headline,
  );
});
