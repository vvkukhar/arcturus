// lib/features/purchases/application/purchase_insights_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_insights_service.dart';

final purchaseInsightsServiceProvider =
    Provider<PurchaseInsightsService>((ref) {
  return PurchaseInsightsService();
});
