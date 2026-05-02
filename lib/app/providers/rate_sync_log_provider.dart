// lib/app/providers/rate_sync_log_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/rate_sync_log_service.dart';

final rateSyncLogServiceProvider = Provider<RateSyncLogService>((ref) {
  return RateSyncLogService(ref);
});
