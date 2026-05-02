import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/services/app_bootstrap_currency_service.dart';

final appBootstrapCurrencyServiceProvider =
    Provider<AppBootstrapCurrencyService>((ref) {
  return AppBootstrapCurrencyService(ref);
});
