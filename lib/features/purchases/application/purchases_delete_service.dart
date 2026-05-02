// lib/features/purchases/application/purchases_delete_service.dart

import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';

class PurchasesDeleteService {
  final PurchasesRepository repository;

  PurchasesDeleteService(this.repository);

  void delete(PurchaseModel purchase) {
    repository.deletePurchase(purchase.id);
  }
}
