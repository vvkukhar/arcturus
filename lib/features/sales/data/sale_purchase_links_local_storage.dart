import 'package:lego_trading_manager/core/storage/local_json_storage.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_model.dart';

class SalePurchaseLinksLocalStorage {
  final LocalJsonStorage storage;
  final SafeJsonListParser parser;

  const SalePurchaseLinksLocalStorage({
    required this.storage,
    required this.parser,
  });

  Future<List<SalePurchaseLinkModel>> read() async {
    final rows = await storage.readList(StorageKeys.salePurchaseLinks);

    return parser.parseList<SalePurchaseLinkModel>(
      rows: rows,
      fromJson: SalePurchaseLinkModel.fromJson,
      isValid: (link) {
        return link.saleId.trim().isNotEmpty &&
            link.purchaseId.trim().isNotEmpty;
      },
    );
  }

  Future<void> write(List<SalePurchaseLinkModel> links) async {
    await storage.writeList(
      StorageKeys.salePurchaseLinks,
      links.map((link) => link.toJson()).toList(),
    );
  }

  Future<void> clear() async {
    await storage.remove(StorageKeys.salePurchaseLinks);
  }
}