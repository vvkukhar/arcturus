import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_model.dart';
import 'package:lego_trading_manager/features/settings/data/app_settings_local_datasource.dart';

class SharedPrefsAppSettingsDatasource implements AppSettingsLocalDatasource {
  static const String _key = 'app_settings_v2';

  @override
  Future<AppSettingsModel> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);

    if (raw == null || raw.trim().isEmpty) {
      return AppSettingsModel.initial();
    }

    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return AppSettingsModel.fromMap(decoded);
  }

  @override
  Future<void> save(AppSettingsModel settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(settings.toMap()));
  }
}