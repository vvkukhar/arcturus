import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/conflicts/conflict_repository_provider.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository_provider.dart';

class SyncHealthCenterModel {
  final int pendingQueueItems;
  final int pendingConflicts;
  final String headline;

  const SyncHealthCenterModel({
    required this.pendingQueueItems,
    required this.pendingConflicts,
    required this.headline,
  });
}

final syncHealthCenterProvider =
    FutureProvider<SyncHealthCenterModel>((ref) async {
  final queueRepository = ref.watch(syncQueueRepositoryProvider);
  final conflictRepository = ref.watch(conflictRepositoryProvider);

  final queue = await queueRepository.getPending();
  final conflicts = await conflictRepository.getPending();

  final headline = conflicts.isNotEmpty
      ? 'Conflicts need review'
      : queue.isNotEmpty
          ? 'Pending offline sync items'
          : 'Sync health looks stable';

  return SyncHealthCenterModel(
    pendingQueueItems: queue.length,
    pendingConflicts: conflicts.length,
    headline: headline,
  );
});