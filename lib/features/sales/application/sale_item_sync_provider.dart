import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_item_sync_service.dart';

final saleItemSyncServiceProvider = Provider<SaleItemSyncService>((ref) {
  return SaleItemSyncService();
});