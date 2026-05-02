import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleRollbackService {
  ItemModel rollbackItem({
    required ItemModel item,
    required SaleModel sale,
  }) {
    return item.copyWith(
      actualSalePrice: null,
      platformSold: null,
      saleDate: null,
      status: ItemStatus.listed,
    );
  }
}