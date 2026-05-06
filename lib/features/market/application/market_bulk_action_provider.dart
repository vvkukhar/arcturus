import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_service.dart';
import 'package:lego_trading_manager/features/market/application/market_duplicate_provider.dart';

final marketBulkActionProvider = Provider<MarketBulkActionService>((ref) {
  return MarketBulkActionService(
    ref.watch(marketDuplicateServiceProvider),
  );
});