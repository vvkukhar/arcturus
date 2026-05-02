import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_service.dart';

final dealHistoryServiceProvider = Provider<DealHistoryService>((ref) {
  return DealHistoryService(ref);
});
