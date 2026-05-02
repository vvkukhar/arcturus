import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_fee_estimator_service.dart';

final saleFeeEstimatorServiceProvider =
    Provider<SaleFeeEstimatorService>((ref) {
  return SaleFeeEstimatorService();
});
