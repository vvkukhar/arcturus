import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_entry_model.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_service.dart';

class BackupHistoryController extends Notifier<List<BackupHistoryEntryModel>> {
  @override
  List<BackupHistoryEntryModel> build() {
    return const [];
  }

  Future<void> load() async {
    state = await ref.read(backupHistoryServiceProvider).getAll();
  }

  Future<void> add({
    required String fileName,
    required int recordCount,
    required String type,
  }) async {
    await ref.read(backupHistoryServiceProvider).add(
          fileName: fileName,
          recordCount: recordCount,
          type: type,
        );
    await load();
  }

  Future<void> clear() async {
    await ref.read(backupHistoryServiceProvider).clear();
    state = const [];
  }
}

final backupHistoryServiceProvider = Provider<BackupHistoryService>((ref) {
  return BackupHistoryService(ref);
});

final backupHistoryProvider =
    NotifierProvider<BackupHistoryController, List<BackupHistoryEntryModel>>(
  BackupHistoryController.new,
);