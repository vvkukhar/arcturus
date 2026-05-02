import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_validation_service.dart';

final saleValidationProvider = Provider<SaleValidationService>((ref) {
  return const SaleValidationService();
});