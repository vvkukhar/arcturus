import 'package:lego_trading_manager/core/validation/app_validator.dart';

class PurchaseFormValidator {
  static String? validateSource(String? value) {
    return AppValidator.requiredText(value, label: 'Source');
  }

  static String? validatePrice(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Purchase price');
  }

  static String? validateShipping(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Shipping');
  }

  static String? validateAdditionalCosts(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Additional costs');
  }
}
