import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage_provider.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser_provider.dart';
import 'package:lego_trading_manager/features/sales/data/sales_local_storage.dart';

final salesLocalStorageProvider = Provider<SalesLocalStorage>((ref) {
  return SalesLocalStorage(
    storage: ref.watch(localJsonStorageProvider),
    parser: ref.watch(safeJsonListParserProvider),
  );
});