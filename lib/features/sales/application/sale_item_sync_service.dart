import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleItemSyncService {
  ItemModel applySale({
    required ItemModel item,
    required SaleModel sale,
  }) {
    return item.copyWith(
      actualSalePrice: sale.salePrice,
      platformSold: sale.platform.name,
      saleDate: sale.saleDate,
      status: ItemStatus.sold,
    );
  }
}