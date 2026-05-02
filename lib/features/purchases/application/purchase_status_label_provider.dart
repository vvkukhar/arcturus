import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

final purchaseStatusLabelProvider =
    Provider.family<String, PurchaseModel>((ref, purchase) {
  final total = purchase.finalTotal;

  if (total >= 5000) return 'large';
  if (total >= 500) return 'normal';
  return 'small';
});