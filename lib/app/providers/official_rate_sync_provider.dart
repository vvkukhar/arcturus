// lib/app/providers/official_rate_sync_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/official_rate_sync_service.dart';

final officialRateSyncServiceProvider =
    Provider<OfficialRateSyncService>((ref) {
  return OfficialRateSyncService(ref);
});
