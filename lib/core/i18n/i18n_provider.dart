import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';
import 'package:lego_trading_manager/core/i18n/app_dictionary.dart';

class I18nNotifier extends Notifier<String> {
  @override
  String build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    return prefs.getString('settings.locale') ?? 'uk';
  }

  void setLocale(String locale) {
    final prefs = ref.read(sharedPreferencesProvider);
    prefs.setString('settings.locale', locale);
    state = locale;
  }

  String t(String key, [Map<String, String>? args]) {
    String text = appDict[state]?[key] ?? appDict['en']?[key] ?? key;
    if (args != null) {
      args.forEach((k, v) {
        text = text.replaceAll('{$k}', v);
      });
    }
    return text;
  }
}

final i18nProvider = NotifierProvider<I18nNotifier, String>(I18nNotifier.new);