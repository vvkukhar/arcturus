import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

final purchasesLargestProvider = Provider<List<PurchaseModel>>((ref) {
  final purchases = [
    ...ref.watch(purchasesControllerProvider),
  ];

  purchases.sort((a, b) => b.finalTotal.compareTo(a.finalTotal));
  return purchases.take(5).toList();
});