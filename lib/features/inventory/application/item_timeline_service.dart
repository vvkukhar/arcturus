import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_event_model.dart';

class ItemTimelineService {
  final Ref ref;

  ItemTimelineService(this.ref);

  List<ItemTimelineEventModel> build(ItemModel item) {
    final result = <ItemTimelineEventModel>[];

    result.add(
      ItemTimelineEventModel(
        title: 'Item created',
        subtitle: item.title,
        date: item.purchaseDate,
        type: 'item',
      ),
    );

    PurchaseModel? purchase;
    for (final entry in ref.read(purchasesRepositoryProvider).getAllPurchases()) {
      if (entry.itemId == item.id) {
        purchase = entry;
        break;
      }
    }

    if (purchase != null) {
      result.add(
        ItemTimelineEventModel(
          title: 'Purchased',
          subtitle: '${purchase.source} • ${purchase.finalTotal.toStringAsFixed(2)} ${purchase.currency}',
          date: purchase.purchaseDate,
          type: 'purchase',
        ),
      );
    }

    final snapshots = ref.read(marketRepositoryProvider).getByItemRef(item.id);
    for (final snapshot in snapshots) {
      result.add(
        ItemTimelineEventModel(
          title: 'Market snapshot',
          subtitle: '${snapshot.source} • L ${snapshot.lowPrice.toStringAsFixed(0)} / A ${snapshot.averagePrice.toStringAsFixed(0)} / H ${snapshot.highPrice.toStringAsFixed(0)}',
          date: snapshot.capturedAt,
          type: 'market',
        ),
      );
    }

    final sale = ref.read(salesRepositoryProvider).getByItemId(item.id);
    if (sale != null) {
      result.add(
        ItemTimelineEventModel(
          title: 'Sold',
          subtitle: '${sale.platform} • net ${sale.finalNet.toStringAsFixed(2)}',
          date: sale.saleDate,
          type: 'sale',
        ),
      );
    }

    result.sort((a, b) {
      final ad = a.date ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bd = b.date ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bd.compareTo(ad);
    });

    return result;
  }
}