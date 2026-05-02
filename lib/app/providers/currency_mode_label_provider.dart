import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_mode_label_service.dart';

final currencyModeLabelServiceProvider =
    Provider<CurrencyModeLabelService>((ref) {
  return CurrencyModeLabelService();
});
