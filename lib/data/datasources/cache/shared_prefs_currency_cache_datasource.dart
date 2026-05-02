// lib/data/datasources/cache/shared_prefs_currency_cache_datasource.dart

import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/models/currency_rates_snapshot_model.dart';
import 'package:lego_trading_manager/data/repositories/currency_rates_repository.dart';

class SharedPrefsCurrencyCacheDatasource
    implements AbstractCurrencyCacheDatasource {
  static const _key = 'currency_rates_snapshot';

  @override
  Future<CurrencyRatesSnapshotModel?> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);

    if (raw == null || raw.trim().isEmpty) return null;

    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return CurrencyRatesSnapshotModel.fromMap(decoded);
  }

  @override
  Future<void> save(CurrencyRatesSnapshotModel snapshot) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(snapshot.toMap()));
  }

  @override
  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
