import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage_provider.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser_provider.dart';
import 'package:lego_trading_manager/features/purchases/data/purchases_local_storage.dart';

final purchasesLocalStorageProvider = Provider<PurchasesLocalStorage>((ref) {
  return PurchasesLocalStorage(
    storage: ref.watch(localJsonStorageProvider),
    parser: ref.watch(safeJsonListParserProvider),
  );
});