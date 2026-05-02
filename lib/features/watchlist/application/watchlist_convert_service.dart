import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistConvertService {
  const WatchlistConvertService();

  ItemModel toInventoryItem(WatchlistItemModel watchlist) {
    return ItemModel(
      id: IdGenerator.next(),
      title: watchlist.title,
      type: watchlist.type,
      theme: watchlist.theme,
      subtheme: null,
      legoNumber: watchlist.refId,
      minifigId: null,
      setId: null,
      condition: ItemCondition.usedGood,
      completeness: ItemCompleteness.unknown,
      ownershipType: OwnershipType.resale,
      purchasePrice: watchlist.marketPrice ?? 0,
      shippingToMe: 0,
      extraCosts: 0,
      totalCost: watchlist.marketPrice ?? 0,
      marketLow: watchlist.marketPrice,
      marketAverage: watchlist.marketPrice,
      expectedSalePrice: watchlist.maxBuyPrice,
      actualSalePrice: null,
      platformBought: 'watchlist',
      platformSold: null,
      status: ItemStatus.planned,
      purchaseDate: DateTime.now(),
      saleDate: null,
      notes: watchlist.comment,
      tags: const ['from_watchlist'],
      photos: const [],
      isTracked: true,
      quantity: 1,
    );
  }
}