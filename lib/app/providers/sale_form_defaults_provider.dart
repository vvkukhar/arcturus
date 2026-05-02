// lib/app/providers/sale_form_defaults_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_form_defaults_service.dart';

final saleFormDefaultsServiceProvider =
    Provider<SaleFormDefaultsService>((ref) {
  return SaleFormDefaultsService();
});
