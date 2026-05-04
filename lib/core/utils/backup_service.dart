import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/file_exporter.dart';
import 'package:lego_trading_manager/core/utils/isolate_json_helper.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

class BackupService {
  static Future<void> createFullBackup(Ref ref) async {
    final payload = {
      'inventory': ref.read(inventoryRepositoryProvider).getAllItems().map((e) => e.toMap()).toList(),
      'purchases': ref.read(purchasesRepositoryProvider).getAllPurchases().map((e) => e.toMap()).toList(),
      'sales': ref.read(salesRepositoryProvider).getAllSales().map((e) => e.toMap()).toList(),
      'watchlist': ref.read(watchlistRepositoryProvider).getAll().map((e) => e.toMap()).toList(),
      'market': ref.read(marketRepositoryProvider).getAll().map((e) => e.toMap()).toList(),
      'partoutProjects': ref.read(partOutRepositoryProvider).getAllProjects().map((e) => e.toMap()).toList(),
      'partoutLines': ref.read(partOutRepositoryProvider)
          .getAllProjects()
          .expand((p) => ref.read(partOutRepositoryProvider).getLinesByProjectId(p.id))
          .map((e) => e.toMap())
          .toList(),
      'createdAt': DateTime.now().toIso8601String(),
    };

    final jsonString = await IsolateJsonHelper.encodePretty(payload);

    await FileExporter.exportText(
      filename: 'full_backup.json',
      content: jsonString,
    );
  }
}