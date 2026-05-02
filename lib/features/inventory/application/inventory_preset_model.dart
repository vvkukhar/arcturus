import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryPresetModel {
  final String id;
  final String title;
  final InventoryFilterModel filter;
  final InventorySortOption sort;

  const InventoryPresetModel({
    required this.id,
    required this.title,
    required this.filter,
    required this.sort,
  });

  static const presets = [
    InventoryPresetModel(
      id: 'all_newest',
      title: 'All / Newest',
      filter: InventoryFilterModel.empty,
      sort: InventorySortOption.newest,
    ),
    InventoryPresetModel(
      id: 'listed_profit',
      title: 'Listed / Profit',
      filter: InventoryFilterModel(
        status: ItemStatus.listed,
      ),
      sort: InventorySortOption.expectedProfitHighToLow,
    ),
    InventoryPresetModel(
      id: 'purchased_oldest',
      title: 'Purchased / Oldest held',
      filter: InventoryFilterModel(
        status: ItemStatus.purchased,
      ),
      sort: InventorySortOption.daysInInventoryHighToLow,
    ),
    InventoryPresetModel(
      id: 'tracked_cost',
      title: 'Tracked / Cost H-L',
      filter: InventoryFilterModel(
        trackedOnly: true,
      ),
      sort: InventorySortOption.costHighToLow,
    ),
  ];
}