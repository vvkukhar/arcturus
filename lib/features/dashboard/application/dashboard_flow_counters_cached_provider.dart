import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_cached_repository_provider.dart';

class DashboardFlowCountersCachedModel {
  final int purchase;
  final int reprice;
  final int review;
  
  const DashboardFlowCountersCachedModel({
    required this.purchase,
    required this.reprice,
    required this.review,
  });
  
  factory DashboardFlowCountersCachedModel.fromJson(Map<String, dynamic> json) {
    return DashboardFlowCountersCachedModel(
      purchase: (json['purchase'] as num?)?.toInt() ?? 0,
      reprice: (json['reprice'] as num?)?.toInt() ?? 0,
      review: (json['review'] as num?)?.toInt() ?? 0,
    );
  }
}

final dashboardFlowCountersCachedProvider = FutureProvider<DashboardFlowCountersCachedModel>((ref) async {
  final repository = ref.watch(dashboardCachedRepositoryProvider);
  final json = await repository.getFlowCounters();
  return DashboardFlowCountersCachedModel.fromJson(json);
});