// lib/features/sales/application/sale_insights_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_insights_service.dart';

final saleInsightsServiceProvider = Provider<SaleInsightsService>((ref) {
  return SaleInsightsService();
});
