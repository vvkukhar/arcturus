import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/item_quick_reprice_service.dart';

final itemQuickRepriceProvider = Provider<ItemQuickRepriceService>((ref) {
  return ItemQuickRepriceService();
});
