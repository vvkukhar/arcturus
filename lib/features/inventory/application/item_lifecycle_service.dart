import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/item_lifecycle_step_model.dart';

class ItemLifecycleService {
  List<ItemLifecycleStepModel> build(ItemModel item) {
    final order = <ItemStatus>[
      ItemStatus.planned,
      ItemStatus.purchased,
      ItemStatus.received,
      ItemStatus.listed,
      ItemStatus.sold,
    ];

    final currentIndex = order.indexOf(item.status);

    return [
      ItemLifecycleStepModel(
        key: 'planned',
        label: 'Planned',
        active: currentIndex >= 0,
      ),
      ItemLifecycleStepModel(
        key: 'purchased',
        label: 'Purchased',
        active: currentIndex >= 1,
      ),
      ItemLifecycleStepModel(
        key: 'received',
        label: 'Received',
        active: currentIndex >= 2,
      ),
      ItemLifecycleStepModel(
        key: 'listed',
        label: 'Listed',
        active: currentIndex >= 3,
      ),
      ItemLifecycleStepModel(
        key: 'sold',
        label: 'Sold',
        active: currentIndex >= 4,
      ),
    ];
  }

  ItemStatus? nextStatus(ItemStatus status) {
    switch (status) {
      case ItemStatus.planned:
        return ItemStatus.purchased;
      case ItemStatus.purchased:
        return ItemStatus.received;
      case ItemStatus.received:
        return ItemStatus.listed;
      case ItemStatus.listed:
        return ItemStatus.sold;
      case ItemStatus.sold:
      case ItemStatus.reserved:
      case ItemStatus.archived:
      case ItemStatus.inDelivery:
      case ItemStatus.restoring:
      case ItemStatus.readyForSale:
      case ItemStatus.found:
        return null;
    }
  }
}