// lib/features/settings/application/currency_display_service.dart

class CurrencyDisplayService {
  String shortInfo({
    required String code,
    required double rateToUah,
  }) {
    return '1 $code = ${rateToUah.toStringAsFixed(4)} UAH';
  }
}
