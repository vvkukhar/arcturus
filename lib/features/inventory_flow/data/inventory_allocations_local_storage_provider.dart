import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage_provider.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/data/inventory_allocations_local_storage.dart';

final inventoryAllocationsLocalStorageProvider =
    Provider<InventoryAllocationsLocalStorage>((ref) {
  return InventoryAllocationsLocalStorage(
    storage: ref.watch(localJsonStorageProvider),
    parser: ref.watch(safeJsonListParserProvider),
  );
});