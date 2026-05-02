import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class StatusColorResolver {
  static Color resolve(ItemStatus status) {
    switch (status) {
      case ItemStatus.sold:
        return Colors.green;
      case ItemStatus.listed:
        return Colors.orange;
      case ItemStatus.received:
        return Colors.blue;
      case ItemStatus.readyForSale:
        return Colors.purple;
      case ItemStatus.purchased:
        return Colors.cyan;
      case ItemStatus.inDelivery:
        return Colors.teal;
      case ItemStatus.restoring:
        return Colors.deepPurple;
      case ItemStatus.archived:
        return Colors.grey;
      case ItemStatus.reserved:
        return Colors.amber;
      case ItemStatus.planned:
        return Colors.blueGrey;
      case ItemStatus.found:
        return Colors.lightBlueAccent;
    }
  }
}
