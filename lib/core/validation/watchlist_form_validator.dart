import 'package:lego_trading_manager/core/validation/app_validator.dart';

class WatchlistFormValidator {
  static String? validateTitle(String? value) {
    return AppValidator.requiredText(value, label: 'Title');
  }

  static String? validateDesiredBuy(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Desired buy');
  }

  static String? validateMaxBuy(String? value) {
    return AppValidator.nonNegativeNumber(value, label: 'Max buy');
  }
}
