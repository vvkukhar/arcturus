import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

final analyticsSummaryProvider = Provider((ref) {
  return ref.read(analyticsRepositoryProvider).getSummary();
});
