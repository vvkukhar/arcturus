import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_consistency_service.dart';

final appDataConsistencyServiceProvider =
    Provider<AppDataConsistencyService>((ref) {
  return const AppDataConsistencyService();
});