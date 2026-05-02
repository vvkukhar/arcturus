import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_form_defaults_service.dart';

final purchaseFormDefaultsProvider = Provider<PurchaseFormDefaultsService>((ref) {
  return const PurchaseFormDefaultsService();
});