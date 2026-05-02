import 'package:lego_trading_manager/core/storage/local_json_storage.dart';
import 'package:lego_trading_manager/core/storage/safe_json_list_parser.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesLocalStorage {
  final LocalJsonStorage storage;
  final SafeJsonListParser parser;

  const SalesLocalStorage({
    required this.storage,
    required this.parser,
  });

  Future<List<SaleModel>> read() async {
    final rows = await storage.readList(StorageKeys.sales);

    return parser.parseList<SaleModel>(
      rows: rows,
      fromJson: SaleModel.fromJson,
      isValid: (sale) => sale.id.trim().isNotEmpty,
    );
  }

  Future<void> write(List<SaleModel> sales) async {
    await storage.writeList(
      StorageKeys.sales,
      sales.map((sale) => sale.toJson()).toList(),
    );
  }

  Future<void> clear() async {
    await storage.remove(StorageKeys.sales);
  }
}