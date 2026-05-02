import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_rollback_service.dart';

final saleRollbackServiceProvider = Provider<SaleRollbackService>((ref) {
  return SaleRollbackService();
});
