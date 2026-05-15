import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/auth/auth_service.dart';
import 'package:lego_trading_manager/core/config/api_config.dart';

class AppBootstrapController extends Notifier<AsyncValue<bool>> {
  @override
  AsyncValue<bool> build() => const AsyncValue.loading();

  // ФІКС: Тягнемо реальні курси НБУ при кожному запуску додатка
  Future<void> _syncNbuRates() async {
    try {
      final res = await http.get(Uri.parse('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'));
      if (res.statusCode == 200) {
        final List<dynamic> data = jsonDecode(res.body);
        final prefs = await SharedPreferences.getInstance();
        
        for (var item in data) {
          final rate = (item['rate'] as num).toDouble();
          if (item['cc'] == 'USD') await prefs.setDouble('settings.usd_to_uah_rate', rate);
          if (item['cc'] == 'EUR') await prefs.setDouble('settings.eur_to_uah_rate', rate);
          if (item['cc'] == 'GBP') await prefs.setDouble('settings.gbp_to_uah_rate', rate);
          if (item['cc'] == 'CAD') await prefs.setDouble('settings.cad_to_uah_rate', rate);
          if (item['cc'] == 'PLN') await prefs.setDouble('settings.pln_to_uah_rate', rate);
        }
      }
    } catch (_) {
      // Якщо немає інтернету, система просто використає останні збережені курси
    }
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      // 1. Оновлюємо курси валют з НБУ
      await _syncNbuRates();

      // 2. Перевіряємо авторизацію
      final auth = AuthService(baseUrl: ApiConfig.baseUrl);
      final isAuth = await auth.isAuthenticated();

      if (!isAuth) {
        state = const AsyncValue.data(false);
        return;
      }

      // 3. Запускаємо двигун синхронізації
      ref.read(syncEngineProvider);

      state = const AsyncValue.data(true);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final appBootstrapControllerProvider = NotifierProvider<AppBootstrapController, AsyncValue<bool>>(AppBootstrapController.new);