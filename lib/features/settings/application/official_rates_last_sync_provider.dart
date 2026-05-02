import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rates_cache_provider.dart';

final officialRatesLastSyncProvider = FutureProvider<DateTime?>((ref) async {
  return ref.read(officialRatesCacheServiceProvider).loadFetchedAt();
});