import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_create_result_model.dart';

class WatchlistPurchaseCreateService {
  const WatchlistPurchaseCreateService();

  WatchlistPurchaseCreateResultModel build(WatchlistItemModel watchlist) {
    final itemId = IdGenerator.next();
    final price = watchlist.marketPrice ?? watchlist.desiredBuyPrice;

    final item = ItemModel(
      id: itemId,
      title: watchlist.title,
      type: watchlist.type == ItemType.set ? ItemType.set : ItemType.minifig,
      theme: watchlist.theme,
      subtheme: null,
      legoNumber: watchlist.refId,
      minifigId: null,
      setId: null,
      condition: ItemCondition.usedGood,
      completeness: ItemCompleteness.unknown,
      ownershipType: OwnershipType.resale,
      purchasePrice: price,
      shippingToMe: 0,
      extraCosts: 0,
      totalCost: price,
      marketLow: watchlist.marketPrice,
      marketAverage: watchlist.marketPrice,
      expectedSalePrice: watchlist.maxBuyPrice,
      actualSalePrice: null,
      platformBought: 'watchlist',
      platformSold: null,
      status: ItemStatus.received,
      purchaseDate: DateTime.now(),
      saleDate: null,
      notes: _note(watchlist),
      tags: const ['from_watchlist'],
      photos: const [],
      isTracked: true,
      quantity: 1,
    );

    final purchase = PurchaseModel(
      id: IdGenerator.next(),
      itemId: itemId,
      source:
          watchlist.theme == null ? 'watchlist' : 'watchlist/${watchlist.theme}',
      sourceUrl: null,
      sellerName: null,
      sellerContact: null,
      purchasePrice: price,
      shippingCost: 0,
      additionalCosts: 0,
      finalTotal: price,
      currency: 'UAH',
      exchangeRate: 1,
      paymentMethod: PurchasePaymentMethod.cash,
      purchaseDate: DateTime.now(),
      note: _note(watchlist),
    );

    return WatchlistPurchaseCreateResultModel(
      item: item,
      purchase: purchase,
    );
  }

  String _note(WatchlistItemModel watchlist) {
    return [
      'Created from watchlist',
      if ((watchlist.refId ?? '').trim().isNotEmpty) 'ref=${watchlist.refId}',
      'target=${watchlist.desiredBuyPrice.toStringAsFixed(2)}',
      'max=${watchlist.maxBuyPrice.toStringAsFixed(2)}',
      if (watchlist.marketPrice != null)
        'market=${watchlist.marketPrice!.toStringAsFixed(2)}',
      if ((watchlist.comment ?? '').trim().isNotEmpty)
        watchlist.comment!.trim(),
    ].join(' | ');
  }
}