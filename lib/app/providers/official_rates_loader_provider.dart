// lib/app/providers/official_rates_loader_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/official_rates_loader_service.dart';

final officialRatesLoaderServiceProvider =
    Provider<OfficialRatesLoaderService>((ref) {
  return OfficialRatesLoaderService(ref);
});
