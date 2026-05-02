import 'package:lego_trading_manager/core/validation/app_validator.dart';

class SaleFormValidator {
  static String? validateSalePrice(String? value) {
    return AppValidator.positiveNumber(value, label: 'Sale price');
  }

  static String? validateFee(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Platform fee');
  }

  static String? validateShipping(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Shipping');
  }
}
