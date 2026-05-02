import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage_provider.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser_provider.dart';
import 'package:lego_trading_manager/features/sales/data/sale_purchase_links_local_storage.dart';

final salePurchaseLinksLocalStorageProvider =
    Provider<SalePurchaseLinksLocalStorage>((ref) {
  return SalePurchaseLinksLocalStorage(
    storage: ref.watch(localJsonStorageProvider),
    parser: ref.watch(safeJsonListParserProvider),
  );
});