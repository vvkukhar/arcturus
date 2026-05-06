import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_duplicate_service.dart';

final marketDuplicateServiceProvider = Provider<MarketDuplicateService>((ref) {
  return MarketDuplicateService();
});