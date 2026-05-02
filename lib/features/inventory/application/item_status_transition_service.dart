import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/item_status_transition_result.dart';

class ItemStatusTransitionService {
  ItemStatus? next(ItemStatus status) {
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

  ItemStatus? previous(ItemStatus status) {
    switch (status) {
      case ItemStatus.planned:
        return null;
      case ItemStatus.purchased:
        return ItemStatus.planned;
      case ItemStatus.received:
        return ItemStatus.purchased;
      case ItemStatus.listed:
        return ItemStatus.received;
      case ItemStatus.sold:
        return ItemStatus.listed;
      case ItemStatus.reserved:
      case ItemStatus.archived:
      case ItemStatus.inDelivery:
      case ItemStatus.restoring:
      case ItemStatus.readyForSale:
      case ItemStatus.found:
        return null;
    }
  }

  ItemModel moveNext(ItemModel item) {
    final target = next(item.status);
    if (target == null) return item;
    return item.copyWith(status: target);
  }

  ItemModel movePrevious(ItemModel item) {
    final target = previous(item.status);
    if (target == null) return item;
    return item.copyWith(status: target);
  }

  ItemStatusTransitionResult transitionForward(ItemModel item) {
    final target = next(item.status);
    return ItemStatusTransitionResult(
      from: item.status,
      to: target ?? item.status,
      changed: target != null,
    );
  }

  ItemStatusTransitionResult transitionBackward(ItemModel item) {
    final target = previous(item.status);
    return ItemStatusTransitionResult(
      from: item.status,
      to: target ?? item.status,
      changed: target != null,
    );
  }
}