// lib/features/analytics/application/analytics_reprice_apply_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_apply_service.dart';

final analyticsRepriceApplyProvider =
    Provider<AnalyticsRepriceApplyService>((ref) {
  return AnalyticsRepriceApplyService(ref);
});
