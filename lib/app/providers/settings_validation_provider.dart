import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/settings_validation_service.dart';

final settingsValidationServiceProvider =
    Provider<SettingsValidationService>((ref) {
  return SettingsValidationService();
});
