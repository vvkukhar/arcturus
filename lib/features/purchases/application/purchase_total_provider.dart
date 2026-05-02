import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_total_service.dart';

final purchaseTotalProvider = Provider<PurchaseTotalService>((ref) {
  return const PurchaseTotalService();
});