import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/item_details/application/item_detail_insights_service.dart';

final itemDetailInsightsProvider = Provider<ItemDetailInsightsService>((ref) {
  return ItemDetailInsightsService();
});