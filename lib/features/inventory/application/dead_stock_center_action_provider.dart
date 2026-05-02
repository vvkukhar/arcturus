import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_center_action_service.dart';

final deadStockCenterActionProvider =
    Provider<DeadStockCenterActionService>((ref) {
  return DeadStockCenterActionService();
});
