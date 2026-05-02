import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';
import 'package:lego_trading_manager/features/deals/application/deal_to_watchlist_draft_model.dart';

class DealToWatchlistDraftService {
  DealToWatchlistDraftModel build(DealEvaluationModel model) {
    final desired = model.askingPrice;
    final max =
        model.askingPrice <= 0 ? model.marketPrice : model.askingPrice * 1.10;

    return DealToWatchlistDraftModel(
      title: model.title,
      desiredBuyPrice: desired,
      maxBuyPrice: max,
      marketPrice: model.marketPrice,
      comment:
          'Created from deal evaluator | verdict=${model.verdict} |\nexpectedProfit=${model.expectedProfit.toStringAsFixed(2)} |\nmargin=${model.marginPercent.toStringAsFixed(1)}%',
    );
  }
}
