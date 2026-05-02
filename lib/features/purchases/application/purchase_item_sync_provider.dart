import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_item_sync_service.dart';

final purchaseItemSyncServiceProvider = Provider<PurchaseItemSyncService>((ref) {
  return PurchaseItemSyncService();
});