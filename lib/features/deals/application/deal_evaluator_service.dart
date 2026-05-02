import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';

class DealEvaluatorService {
  DealEvaluationModel evaluate({
    required String title,
    required double askingPrice,
    required double marketPrice,
  }) {
    final expectedProfit = marketPrice - askingPrice;
    final margin =
        askingPrice <= 0 ? 0.0 : (expectedProfit / askingPrice) * 100;

    String verdict;

    if (expectedProfit <= 0) {
      verdict = 'avoid';
    } else if (margin >= 40) {
      verdict = 'strong buy';
    } else if (margin >= 20) {
      verdict = 'good';
    } else {
      verdict = 'weak';
    }

    return DealEvaluationModel(
      title: title,
      askingPrice: askingPrice,
      marketPrice: marketPrice,
      expectedProfit: expectedProfit,
      marginPercent: margin,
      verdict: verdict,
    );
  }
}
