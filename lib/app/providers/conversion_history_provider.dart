// lib/app/providers/conversion_history_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/conversion_history_service.dart';

final conversionHistoryServiceProvider =
    Provider<ConversionHistoryService>((ref) {
  return ConversionHistoryService(ref);
});
