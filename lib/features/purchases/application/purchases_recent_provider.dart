import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

final purchasesRecentProvider = Provider<List<PurchaseModel>>((ref) {
  final purchases = [
    ...ref.watch(purchasesControllerProvider).allPurchases,
  ];

  purchases.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate));
  return purchases.take(5).toList();
});