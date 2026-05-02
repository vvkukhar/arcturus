import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_price_signal_model.dart';

class WatchlistPriceSignalService {
  const WatchlistPriceSignalService();

  WatchlistPriceSignalModel? build(WatchlistItemModel item) {
    final market = item.marketPrice;
    if (market == null) return null;

    final desiredGap = market - item.desiredBuyPrice;
    final maxGap = market - item.maxBuyPrice;
    final underDesired = market <= item.desiredBuyPrice;
    final underMax = market <= item.maxBuyPrice;

    final label = underDesired
        ? 'target hit'
        : underMax
            ? 'under max'
            : 'above max';

    return WatchlistPriceSignalModel(
      label: label,
      marketPrice: market,
      desiredBuyPrice: item.desiredBuyPrice,
      maxBuyPrice: item.maxBuyPrice,
      desiredGap: desiredGap,
      maxGap: maxGap,
      underDesired: underDesired,
      underMax: underMax,
    );
  }
}