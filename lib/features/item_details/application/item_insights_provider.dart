import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/item_details/application/item_insights_service.dart';

final itemInsightsServiceProvider = Provider<ItemInsightsService>((ref) {
  return ItemInsightsService();
});