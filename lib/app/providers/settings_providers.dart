import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/data/app_settings_repository.dart';
import 'package:lego_trading_manager/features/settings/data/shared_prefs_app_settings_datasource.dart';

final settingsRepositoryProvider = Provider<AppSettingsRepository>((ref) {
  return AppSettingsRepository(
    localDatasource: SharedPrefsAppSettingsDatasource(),
  );
});
