import 'package:lego_trading_manager/core/storage/local_json_storage.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesLocalStorage {
  final LocalJsonStorage storage;
  final SafeJsonListParser parser;

  const PurchasesLocalStorage({
    required this.storage,
    required this.parser,
  });

  Future<List<PurchaseModel>> read() async {
    final rows = await storage.readList(StorageKeys.purchases);

    return parser.parseList<PurchaseModel>(
      rows: rows,
      fromJson: PurchaseModel.fromJson,
      isValid: (purchase) => purchase.id.trim().isNotEmpty,
    );
  }

  Future<void> write(List<PurchaseModel> purchases) async {
    await storage.writeList(
      StorageKeys.purchases,
      purchases.map((purchase) => purchase.toJson()).toList(),
    );
  }

  Future<void> clear() async {
    await storage.remove(StorageKeys.purchases);
  }
}