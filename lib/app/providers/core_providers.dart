import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/core/services/currency_converter.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError();
});

final baseCurrencyProvider = StateProvider<String>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return prefs.getString('settings.base_currency') ?? 'UAH';
});

final currencyConverterProvider = Provider<CurrencyConverter>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  final base = ref.watch(baseCurrencyProvider);
  return CurrencyConverter(
    baseCurrency: base,
    usdRate: prefs.getDouble('settings.usd_to_uah_rate') ?? 41.5,
    eurRate: prefs.getDouble('settings.eur_to_uah_rate') ?? 45.2,
    cadRate: prefs.getDouble('settings.cad_to_uah_rate') ?? 30.5,
    gbpRate: prefs.getDouble('settings.gbp_to_uah_rate') ?? 52.1,
  );
});