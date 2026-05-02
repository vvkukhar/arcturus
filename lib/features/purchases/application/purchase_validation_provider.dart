import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_validation_service.dart';

final purchaseValidationProvider = Provider<PurchaseValidationService>((ref) {
  return const PurchaseValidationService();
});