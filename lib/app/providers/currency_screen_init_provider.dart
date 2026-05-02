import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_screen_init_service.dart';

final currencyScreenInitServiceProvider =
    Provider<CurrencyScreenInitService>((ref) {
  return CurrencyScreenInitService(ref);
});
