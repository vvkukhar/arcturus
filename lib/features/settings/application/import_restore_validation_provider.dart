import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/import_restore_validation_service.dart';

final importRestoreValidationProvider =
    Provider<ImportRestoreValidationService>((ref) {
  return ImportRestoreValidationService();
});