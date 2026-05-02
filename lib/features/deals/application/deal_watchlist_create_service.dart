import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/deals/application/deal_evaluation_model.dart';
import 'package:lego_trading_manager/features/deals/application/deal_watchlist_create_result_model.dart';

class DealWatchlistCreateService {
  DealWatchlistCreateResultModel build(DealEvaluationModel model) {
    final watchlistItem = WatchlistItemModel(
      id: IdGenerator.next(),
      title: model.title,
      type: ItemType.minifig,
      theme: null,
      refId: null,
      desiredBuyPrice: model.askingPrice,
      maxBuyPrice:
          model.askingPrice <= 0 ? model.marketPrice : model.askingPrice * 1.10,
      marketPrice: model.marketPrice,
      comment:
          'Created from deal evaluator | verdict=${model.verdict} |\nexpectedProfit=${model.expectedProfit.toStringAsFixed(2)} |\nmargin=${model.marginPercent.toStringAsFixed(1)}%',
      createdAt: DateTime.now(),
      isActive: true,
    );

    return DealWatchlistCreateResultModel(
      watchlistItem: watchlistItem,
    );
  }
}
