import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_bulk_reprice_service.dart';

final analyticsBulkRepriceProvider =
    Provider<AnalyticsBulkRepriceService>((ref) {
  return AnalyticsBulkRepriceService(ref);
});
