// lib/features/sales/application/sale_insights_service.dart

import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleInsightsService {
  String feePercent(SaleModel sale) {
    if (sale.salePrice <= 0) return '0.0';
    return ((sale.platformFee / sale.salePrice) * 100).toStringAsFixed(1);
  }

  String shippingPercent(SaleModel sale) {
    if (sale.salePrice <= 0) return '0.0';
    return ((sale.shippingPaidByMe / sale.salePrice) * 100).toStringAsFixed(1);
  }

  String netMargin(SaleModel sale) {
    if (sale.salePrice <= 0) return '0.0';
    return ((sale.finalNet / sale.salePrice) * 100).toStringAsFixed(1);
  }
}
