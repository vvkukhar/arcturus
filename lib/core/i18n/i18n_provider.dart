import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/app_dictionary.dart';

class I18nNotifier extends Notifier<String> {
  @override
  String build() => 'uk';

  void setLocale(String locale) {
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