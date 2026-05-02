import 'package:lego_trading_manager/core/enums/item_status.dart';

class ItemStatusTransitionResult {
  final ItemStatus from;
  final ItemStatus to;
  final bool changed;

  const ItemStatusTransitionResult({
    required this.from,
    required this.to,
    required this.changed,
  });
}
