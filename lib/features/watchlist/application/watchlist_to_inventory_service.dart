import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_service.dart';

class WatchlistToInventoryService {
  final InventoryRepository inventoryRepository;
  final WatchlistRepository watchlistRepository;
  final WatchlistConvertService convertService;

  const WatchlistToInventoryService({
    required this.inventoryRepository,
    required this.watchlistRepository,
    required this.convertService,
  });

  ItemModel convertAndAdd({
    required WatchlistItemModel watchlistItem,
    bool deactivateSource = true,
  }) {
    final inventoryItem = convertService.toInventoryItem(watchlistItem);

    inventoryRepository.addItem(inventoryItem);

    if (deactivateSource) {
      watchlistRepository.update(
        watchlistItem.copyWith(isActive: false),
      );
    }

    return inventoryItem;
  }
}