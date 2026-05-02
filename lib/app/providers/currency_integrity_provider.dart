import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_integrity_service.dart';

final currencyIntegrityServiceProvider =
    Provider<CurrencyIntegrityService>((ref) {
  return CurrencyIntegrityService();
});
