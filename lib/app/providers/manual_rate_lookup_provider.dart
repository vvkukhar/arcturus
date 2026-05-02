import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_rate_lookup_service.dart';

final manualRateLookupServiceProvider =
    Provider<ManualRateLookupService>((ref) {
  return ManualRateLookupService();
});
