// lib/features/inventory/application/inventory_duplicate_service.dart

import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryDuplicateService {
  ItemModel duplicate(ItemModel item) {
    return item.copyWith(
      id: IdGenerator.next(),
      title: '${item.title} (Copy)',
      status: ItemStatus.planned,
      actualSalePrice: null,
      saleDate: null,
      platformSold: null,
      purchaseDate: DateTime.now(),
    );
  }
}
