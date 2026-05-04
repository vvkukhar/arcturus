import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_service.dart';

final itemTimelineServiceProvider = Provider<ItemTimelineService>((ref) {
  return ItemTimelineService(ref);
});