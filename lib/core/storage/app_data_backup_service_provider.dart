import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_backup_service.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage_provider.dart';

final appDataBackupServiceProvider = Provider<AppDataBackupService>((ref) {
  final storage = ref.watch(localJsonStorageProvider);
  return AppDataBackupService(storage);
});