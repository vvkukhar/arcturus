import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sync/data/sync_api_repository_provider.dart';

class GlobalSyncStateModel {
  final bool isRunning;
  final DateTime? startedAt;
  final DateTime? finishedAt;
  final String? lastMode;
  final int processedItems;
  final int totalItems;

  const GlobalSyncStateModel({
    required this.isRunning,
    required this.startedAt,
    required this.finishedAt,
    required this.lastMode,
    required this.processedItems,
    required this.totalItems,
  });

  factory GlobalSyncStateModel.fromJson(Map<String, dynamic> json) {
    return GlobalSyncStateModel(
      isRunning: json['isRunning'] as bool? ?? false,
      startedAt: json['startedAt'] != null
          ? DateTime.tryParse(json['startedAt'] as String)
          : null,
      finishedAt: json['finishedAt'] != null
          ? DateTime.tryParse(json['finishedAt'] as String)
          : null,
      lastMode: json['lastMode'] as String?,
      processedItems: (json['processedItems'] as num?)?.toInt() ?? 0,
      totalItems: (json['totalItems'] as num?)?.toInt() ?? 0,
    );
  }

  double get progressRatio {
    if (totalItems <= 0) return 0;
    return processedItems / totalItems;
  }
}

final globalSyncStateProvider =
    FutureProvider<GlobalSyncStateModel>((ref) async {
  final repository = ref.watch(syncApiRepositoryProvider);
  final json = await repository.getSyncState();
  return GlobalSyncStateModel.fromJson(json);
});