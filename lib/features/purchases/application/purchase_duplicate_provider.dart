import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_duplicate_service.dart';

final purchaseDuplicateProvider = Provider<PurchaseDuplicateService>((ref) {
  return const PurchaseDuplicateService();
});