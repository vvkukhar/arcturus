import 'package:lego_trading_manager/core/storage/local_json_storage.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';

class InventoryAllocationsLocalStorage {
  final LocalJsonStorage storage;
  final SafeJsonListParser parser;

  const InventoryAllocationsLocalStorage({
    required this.storage,
    required this.parser,
  });

  Future<List<InventorySaleAllocationModel>> read() async {
    final rows = await storage.readList(StorageKeys.inventoryAllocations);

    return parser.parseList<InventorySaleAllocationModel>(
      rows: rows,
      fromJson: InventorySaleAllocationModel.fromJson,
      isValid: (allocation) {
        return allocation.saleId.trim().isNotEmpty &&
            allocation.purchaseId.trim().isNotEmpty &&
            allocation.quantity > 0;
      },
    );
  }

  Future<void> write(List<InventorySaleAllocationModel> allocations) async {
    await storage.writeList(
      StorageKeys.inventoryAllocations,
      allocations.map((allocation) => allocation.toJson()).toList(),
    );
  }

  Future<void> clear() async {
    await storage.remove(StorageKeys.inventoryAllocations);
  }
}