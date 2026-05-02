// lib/data/datasources/manual/shared_prefs_manual_currency_rates_datasource.dart

import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';
import 'package:lego_trading_manager/data/repositories/manual_currency_rates_repository.dart';

class SharedPrefsManualCurrencyRatesDatasource
    implements AbstractManualCurrencyRatesDatasource {
  static const _key = 'manual_currency_rates';

  @override
  Future<List<ManualCurrencyRateModel>> getAll() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);

    if (raw == null || raw.trim().isEmpty) return const [];

    final decoded = jsonDecode(raw) as List;
    return decoded
        .map(
          (e) => ManualCurrencyRateModel.fromMap(
            Map<String, dynamic>.from(e as Map),
          ),
        )
        .toList();
  }

  @override
  Future<void> saveAll(List<ManualCurrencyRateModel> items) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _key,
      jsonEncode(items.map((e) => e.toMap()).toList()),
    );
  }
}
