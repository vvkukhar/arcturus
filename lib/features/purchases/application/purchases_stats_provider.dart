import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

final purchasesCountProvider = Provider<int>((ref) {
  return ref.watch(purchasesControllerProvider).length;
});

final purchasesTotalSpendProvider = Provider<double>((ref) {
  final purchases = ref.watch(purchasesControllerProvider);

  return purchases.fold<double>(
    0,
    (sum, item) => sum + item.finalTotal,
  );
});

final purchasesShippingTotalProvider = Provider<double>((ref) {
  final purchases = ref.watch(purchasesControllerProvider);

  return purchases.fold<double>(
    0,
    (sum, item) => sum + item.shippingCost,
  );
});