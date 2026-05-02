import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_service.dart';

class WatchlistConvertFlowService {
  final WatchlistConvertService convertService;

  const WatchlistConvertFlowService(this.convertService);

  ItemModel convert(WatchlistItemModel item) {
    return convertService.toInventoryItem(item);
  }
}