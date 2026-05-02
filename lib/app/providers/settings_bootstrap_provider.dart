import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/settings_bootstrap_service.dart';

final settingsBootstrapServiceProvider =
    Provider<SettingsBootstrapService>((ref) {
  return SettingsBootstrapService(ref);
});
