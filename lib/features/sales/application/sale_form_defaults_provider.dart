import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_form_defaults_service.dart';

final saleFormDefaultsProvider = Provider<SaleFormDefaultsService>((ref) {
  return const SaleFormDefaultsService();
});