import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_priority_queue_cached_provider.dart';

class DashboardPriorityQueueApiItemModel {
  final String action;
  final String reasonPrimary;
  final double score;
  
  const DashboardPriorityQueueApiItemModel({
    required this.action,
    required this.reasonPrimary,
    required this.score,
  });
}

final dashboardPriorityQueueApiProvider = FutureProvider<List<DashboardPriorityQueueApiItemModel>>((ref) async {
  final cached = await ref.watch(dashboardPriorityQueueCachedProvider.future);
  return cached
      .map(
        (item) => DashboardPriorityQueueApiItemModel(
          action: item.action,
          reasonPrimary: item.reasonPrimary,
          score: item.score,
        ),
      )
      .toList();
});