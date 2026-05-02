import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/item_status_transition_service.dart';

final itemStatusTransitionProvider =
    Provider<ItemStatusTransitionService>((ref) {
  return ItemStatusTransitionService();
});
