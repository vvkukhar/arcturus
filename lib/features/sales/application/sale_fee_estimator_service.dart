// lib/features/sales/application/sale_fee_estimator_service.dart

import 'package:lego_trading_manager/core/services/fee_percent_calculator.dart';

class SaleFeeEstimatorService {
  double estimate({
    required double salePrice,
    required double percent,
  }) {
    return FeePercentCalculator.fromPercent(
      base: salePrice,
      percent: percent,
    );
  }
}
