// lib/features/sales/application/sales_delete_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/features/sales/application/sale_rollback_service.dart';

class SalesDeleteService {
  final SalesRepository salesRepository;
  final InventoryRepository inventoryRepository;
  final SaleRollbackService rollbackService;

  SalesDeleteService({
    required this.salesRepository,
    required this.inventoryRepository,
    required this.rollbackService,
  });

  void deleteSaleAndRollback({
    required SaleModel sale,
    required ItemModel item,
  }) {
    final reverted = rollbackService.rollbackItem(item: item, sale: sale);
    salesRepository.deleteSale(sale.id);
    inventoryRepository.updateItem(reverted);
  }
}
