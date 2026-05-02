import 'package:lego_trading_manager/features/settings/application/app_settings_model.dart';
import 'package:lego_trading_manager/features/settings/data/app_settings_local_datasource.dart';
import 'package:lego_trading_manager/features/settings/data/shared_prefs_app_settings_datasource.dart';

class AppSettingsRepository {
  final AppSettingsLocalDatasource _localDatasource;

  AppSettingsRepository({
    AppSettingsLocalDatasource? localDatasource,
  }) : _localDatasource = localDatasource ?? SharedPrefsAppSettingsDatasource();

  Future<AppSettingsModel> load() {
    return _localDatasource.load();
  }

  Future<void> save(AppSettingsModel settings) {
    return _localDatasource.save(settings);
  }
}