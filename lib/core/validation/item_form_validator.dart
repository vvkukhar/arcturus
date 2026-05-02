import 'package:lego_trading_manager/core/validation/app_validator.dart';

class ItemFormValidator {
  static String? validateTitle(String? value) {
    return AppValidator.requiredText(value, label: 'Title');
  }

  static String? validatePurchasePrice(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Purchase price');
  }

  static String? validateShipping(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Shipping');
  }

  static String? validateExtraCosts(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Extra costs');
  }
}
