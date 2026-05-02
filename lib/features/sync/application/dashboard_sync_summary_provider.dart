import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sync/data/sync_api_repository_provider.dart';

class DashboardSyncSummaryModel {
  final int totalItems;
  final int fresh;
  final int recent;
  final int aging;
  final int stale;
  final int veryStale;
  final int missing;

  const DashboardSyncSummaryModel({
    required this.totalItems,
    required this.fresh,
    required this.recent,
    required this.aging,
    required this.stale,
    required this.veryStale,
    required this.missing,
  });

  factory DashboardSyncSummaryModel.fromJson(Map<String, dynamic> json) {
    return DashboardSyncSummaryModel(
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
      fresh: (json['fresh'] as num?)?.toInt() ?? 0,
      recent: (json['recent'] as num?)?.toInt() ?? 0,
      aging: (json['aging'] as num?)?.toInt() ?? 0,
      stale: (json['stale'] as num?)?.toInt() ?? 0,
      veryStale: (json['veryStale'] as num?)?.toInt() ?? 0,
      missing: (json['missing'] as num?)?.toInt() ?? 0,
    );
  }
}

final dashboardSyncSummaryProvider =
    FutureProvider<DashboardSyncSummaryModel>((ref) async {
  final repository = ref.watch(syncApiRepositoryProvider);
  final json = await repository.getDashboardSummary();
  return DashboardSyncSummaryModel.fromJson(json);
});