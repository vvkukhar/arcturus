import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_currency_service.dart';

final purchaseCurrencyServiceProvider = Provider<PurchaseCurrencyService>((ref) {
  return PurchaseCurrencyService();
});