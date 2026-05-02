import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/bootstrap/app_reload_service.dart';
import 'package:lego_trading_manager/core/storage/app_data_cleanup_report_model.dart';

class AppDataIntegrityCleanupService {
  final Ref ref;

  const AppDataIntegrityCleanupService(this.ref);

  Future<AppDataCleanupReportModel> cleanup() async {
    return ref.read(appReloadServiceProvider).cleanupPersistentRelations();
  }
}

final appDataIntegrityCleanupServiceProvider =
    Provider<AppDataIntegrityCleanupService>((ref) {
  return AppDataIntegrityCleanupService(ref);
});