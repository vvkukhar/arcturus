// lib/core/services/trading_transaction_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';

class TradingTransactionService {
  final InventoryRepository inventoryRepository;
  final PurchasesRepository purchasesRepository;
  final SalesRepository salesRepository;

  TradingTransactionService({
    required this.inventoryRepository,
    required this.purchasesRepository,
    required this.salesRepository,
  });

  void recordPurchase({
    required PurchaseModel purchase,
    required ItemModel updatedItem,
  }) {
    purchasesRepository.addPurchase(purchase);
    inventoryRepository.updateItem(updatedItem);
  }

  void recordSale({
    required SaleModel sale,
    required ItemModel updatedItem,
  }) {
    salesRepository.addSale(sale);
    inventoryRepository.updateItem(updatedItem);
  }
}
