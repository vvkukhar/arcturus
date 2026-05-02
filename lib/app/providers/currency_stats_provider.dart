import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_stats_service.dart';

final currencyStatsServiceProvider = Provider<CurrencyStatsService>((ref) {
  return CurrencyStatsService();
});
