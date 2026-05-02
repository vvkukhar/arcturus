import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_convert_service.dart';

final currencyConvertServiceProvider = Provider<CurrencyConvertService>((ref) {
  return CurrencyConvertService();
});
