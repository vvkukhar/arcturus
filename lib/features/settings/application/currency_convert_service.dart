// lib/features/settings/application/currency_convert_service.dart

import 'package:lego_trading_manager/core/utils/currency_pair_converter.dart';
import 'package:lego_trading_manager/core/utils/safe_uppercase.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyConvertService {
  double convert({
    required double amount,
    required String from,
    required String to,
    required List<CurrencyRateModel> rates,
  }) {
    final fromCode = SafeUppercase.call(from);
    final toCode = SafeUppercase.call(to);

    if (fromCode == toCode) return amount;

    final fromRate = _resolveRateToUah(code: fromCode, rates: rates);
    final toRate = _resolveRateToUah(code: toCode, rates: rates);

    return CurrencyPairConverter.convert(
      amount: amount,
      fromRateToUah: fromRate,
      toRateToUah: toRate,
    );
  }

  double _resolveRateToUah({
    required String code,
    required List<CurrencyRateModel> rates,
  }) {
    if (code == 'UAH') return 1;

    final item = rates.firstWhere((e) => e.code == code);
    return item.rate;
  }
}
