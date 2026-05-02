import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluator_service.dart';

final dealEvaluatorProvider = Provider<DealEvaluatorService>((ref) {
  return DealEvaluatorService();
});
