// lib/features/settings/application/sale_currency_preview_service.dart

class SaleCurrencyPreviewService {
  double convertToBase({
    required double salePrice,
    required double exchangeRate,
  }) {
    return salePrice * exchangeRate;
  }
}
