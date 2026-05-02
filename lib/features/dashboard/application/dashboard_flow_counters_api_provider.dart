import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_cached_provider.dart';

class DashboardFlowCountersApiModel {
  final int purchase;
  final int reprice;
  final int review;
  const DashboardFlowCountersApiModel({
    required this.purchase,
    required this.reprice,
    required this.review,
  });
}

final dashboardFlowCountersApiProvider =
    FutureProvider<DashboardFlowCountersApiModel>((ref) async {
  final cached = await ref.watch(dashboardFlowCountersCachedProvider.future);
  return DashboardFlowCountersApiModel(
    purchase: cached.purchase,
    reprice: cached.reprice,
    review: cached.review,
  );
});
