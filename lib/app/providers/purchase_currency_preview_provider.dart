import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/purchase_currency_preview_service.dart';

final purchaseCurrencyPreviewServiceProvider =
    Provider<PurchaseCurrencyPreviewService>((ref) {
  return PurchaseCurrencyPreviewService();
});
