// lib/data/datasources/cache/shared_prefs_cache_datasource.dart

import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/repositories/cache_repository.dart';

class SharedPrefsCacheDatasource implements AbstractCacheDatasource {
  @override
  Future<String?> get(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  @override
  Future<void> set(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  @override
  Future<void> delete(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }
}
