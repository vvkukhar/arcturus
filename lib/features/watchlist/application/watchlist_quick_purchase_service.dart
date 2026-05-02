import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_service.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_quick_purchase_payload.dart';

class WatchlistQuickPurchaseService {
  final InventoryRepository inventoryRepository;
  final WatchlistRepository watchlistRepository;
  final WatchlistConvertService convertService;

  const WatchlistQuickPurchaseService({
    required this.inventoryRepository,
    required this.watchlistRepository,
    required this.convertService,
  });

  WatchlistQuickPurchasePayload prepare({
    required WatchlistItemModel watchlistItem,
  }) {
    final inventoryItem = convertService.toInventoryItem(watchlistItem);
    final updatedWatchlistItem = watchlistItem.copyWith(isActive: false);

    inventoryRepository.addItem(inventoryItem);
    watchlistRepository.update(updatedWatchlistItem);

    return WatchlistQuickPurchasePayload(
      watchlistItem: updatedWatchlistItem,
      inventoryItem: inventoryItem,
    );
  }
}