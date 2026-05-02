// lib/app/providers/purchase_form_defaults_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_form_defaults_service.dart';

final purchaseFormDefaultsServiceProvider =
    Provider<PurchaseFormDefaultsService>((ref) {
  return PurchaseFormDefaultsService();
});
