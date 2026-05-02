import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_apply_usecase.dart';

final marketBulkApplyProvider = Provider<MarketBulkApplyUsecase>((ref) {
  return MarketBulkApplyUsecase(ref);
});
