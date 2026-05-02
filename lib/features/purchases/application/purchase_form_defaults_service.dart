import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';

class PurchaseFormDefaultsService {
  const PurchaseFormDefaultsService();

  String defaultCurrency() => 'UAH';

  double defaultExchangeRate() => 1;

  PurchasePaymentMethod defaultPaymentMethod() {
    return PurchasePaymentMethod.cash;
  }

  DateTime defaultPurchaseDate() {
    return DateTime.now();
  }
}