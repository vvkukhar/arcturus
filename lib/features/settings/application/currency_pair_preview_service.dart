// lib/features/settings/application/currency_pair_preview_service.dart

import 'package:lego_trading_manager/data/models/currency_pair_preview_model.dart';

class CurrencyPairPreviewService {
  CurrencyPairPreviewModel build({
    required String from,
    required String to,
    required double rate,
  }) {
    return CurrencyPairPreviewModel(
      from: from,
      to: to,
      rate: rate,
    );
  }
}
