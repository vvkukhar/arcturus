import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_display_service.dart';

final currencyDisplayServiceProvider = Provider<CurrencyDisplayService>((ref) {
  return CurrencyDisplayService();
});
