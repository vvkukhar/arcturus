import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_pair_preview_service.dart';

final currencyPairPreviewServiceProvider =
    Provider<CurrencyPairPreviewService>((ref) {
  return CurrencyPairPreviewService();
});
