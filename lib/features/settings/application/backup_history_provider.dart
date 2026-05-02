import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_entry_model.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_service.dart';

class BackupHistoryController
    extends StateNotifier<List<BackupHistoryEntryModel>> {
  final BackupHistoryService service;

  BackupHistoryController(this.service) : super(const []);

  Future<void> load() async {
    state = await service.getAll();
  }

  Future<void> add({
    required String fileName,
    required int recordCount,
    required String type,
  }) async {
    await service.add(
      fileName: fileName,
      recordCount: recordCount,
      type: type,
    );
    await load();
  }

  Future<void> clear() async {
    await service.clear();
    state = const [];
  }
}

final backupHistoryServiceProvider = Provider<BackupHistoryService>((ref) {
  return BackupHistoryService(ref);
});

final backupHistoryProvider =
    StateNotifierProvider<BackupHistoryController, List<BackupHistoryEntryModel>>(
  (ref) => BackupHistoryController(
    ref.watch(backupHistoryServiceProvider),
  ),
);