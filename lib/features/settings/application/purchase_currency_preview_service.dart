// lib/features/settings/application/purchase_currency_preview_service.dart

class PurchaseCurrencyPreviewService {
  double convertToBase({
    required double finalTotal,
    required double exchangeRate,
  }) {
    return finalTotal * exchangeRate;
  }
}
