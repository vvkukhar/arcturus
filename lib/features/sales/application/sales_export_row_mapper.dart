import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesExportRowMapper {
  static List<String> map(SaleModel sale) {
    return [
      sale.id,
      sale.itemId,
      sale.platform.name,
      sale.buyerName ?? '',
      sale.salePrice.toString(),
      sale.platformFee.toString(),
      sale.shippingPaidByMe.toString(),
      sale.finalNet.toString(),
      sale.saleDate.toIso8601String(),
    ];
  }
}
