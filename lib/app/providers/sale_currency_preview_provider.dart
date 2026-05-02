import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/sale_currency_preview_service.dart';

final saleCurrencyPreviewServiceProvider =
    Provider<SaleCurrencyPreviewService>((ref) {
  return SaleCurrencyPreviewService();
});
