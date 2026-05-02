import 'package:lego_trading_manager/features/settings/application/app_settings_model.dart';

abstract class AppSettingsLocalDatasource {
  Future<AppSettingsModel> load();
  Future<void> save(AppSettingsModel settings);
}