import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_currency_service.dart';

final saleCurrencyServiceProvider = Provider<SaleCurrencyService>((ref) {
  return SaleCurrencyService();
});
