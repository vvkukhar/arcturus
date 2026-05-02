// lib/app/providers/official_rates_cache_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/official_rates_cache_service.dart';

final officialRatesCacheServiceProvider =
    Provider<OfficialRatesCacheService>((ref) {
  return OfficialRatesCacheService(ref);
});
