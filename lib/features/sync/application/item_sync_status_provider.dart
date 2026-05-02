import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sync/data/sync_api_repository_provider.dart';

class ItemSyncStatusModel {
  final String itemId;
  final DateTime? latestSnapshotAt;
  final DateTime? latestDecisionAt;
  final DateTime? latestListingAt;
  final String snapshotFreshnessLabel;
  final bool needsRefresh;

  const ItemSyncStatusModel({
    required this.itemId,
    required this.latestSnapshotAt,
    required this.latestDecisionAt,
    required this.latestListingAt,
    required this.snapshotFreshnessLabel,
    required this.needsRefresh,
  });

  factory ItemSyncStatusModel.fromJson(Map<String, dynamic> json) {
    return ItemSyncStatusModel(
      itemId: json['itemId'] as String? ?? '',
      latestSnapshotAt: json['latestSnapshotAt'] != null
          ? DateTime.tryParse(json['latestSnapshotAt'] as String)
          : null,
      latestDecisionAt: json['latestDecisionAt'] != null
          ? DateTime.tryParse(json['latestDecisionAt'] as String)
          : null,
      latestListingAt: json['latestListingAt'] != null
          ? DateTime.tryParse(json['latestListingAt'] as String)
          : null,
      snapshotFreshnessLabel:
          json['snapshotFreshnessLabel'] as String? ?? 'missing',
      needsRefresh: json['needsRefresh'] as bool? ?? true,
    );
  }
}

final itemSyncStatusProvider =
    FutureProvider.family.autoDispose<ItemSyncStatusModel, String>((
  ref,
  itemId,
) async {
  final repository = ref.watch(syncApiRepositoryProvider);
  final json = await repository.getItemStatus(itemId);
  return ItemSyncStatusModel.fromJson(json);
});