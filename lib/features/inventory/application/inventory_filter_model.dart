import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryFilterModel {
  final ItemStatus? status;
  final bool trackedOnly;
  final String? themeContains;

  const InventoryFilterModel({
    this.status,
    this.trackedOnly = false,
    this.themeContains,
  });

  static const empty = InventoryFilterModel();

  InventoryFilterModel copyWith({
    ItemStatus? status,
    bool clearStatus = false,
    bool? trackedOnly,
    String? themeContains,
    bool clearThemeContains = false,
  }) {
    return InventoryFilterModel(
      status: clearStatus ? null : (status ?? this.status),
      trackedOnly: trackedOnly ?? this.trackedOnly,
      themeContains:
          clearThemeContains ? null : (themeContains ?? this.themeContains),
    );
  }
}
