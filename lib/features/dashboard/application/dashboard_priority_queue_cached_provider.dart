import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_cached_repository_provider.dart';

class DashboardPriorityQueueCachedItemModel {
  final String action;
  final String reasonPrimary;
  final double score;
  
  const DashboardPriorityQueueCachedItemModel({
    required this.action,
    required this.reasonPrimary,
    required this.score,
  });
  
  factory DashboardPriorityQueueCachedItemModel.fromJson(Map<String, dynamic> json) {
    return DashboardPriorityQueueCachedItemModel(
      action: json['action'] as String? ?? '',
      reasonPrimary: json['reasonPrimary'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0,
    );
  }
}

final dashboardPriorityQueueCachedProvider = FutureProvider<List<DashboardPriorityQueueCachedItemModel>>((ref) async {
  final repository = ref.watch(dashboardCachedRepositoryProvider);
  final json = await repository.getPriorityQueue();
  return json.map(DashboardPriorityQueueCachedItemModel.fromJson).toList();
});