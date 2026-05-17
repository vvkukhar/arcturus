import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class SystemToolsState {
  final bool isExporting;
  final bool isImporting;
  final String? lastMessage;
  const SystemToolsState({this.isExporting = false, this.isImporting = false, this.lastMessage});
}

class SystemToolsEngine extends AsyncNotifier<SystemToolsState> {
  @override
  Future<SystemToolsState> build() async {
    return const SystemToolsState();
  }

  Future<void> _exportAndShare(String endpoint, String filename, String successMessage) async {
    state = const AsyncValue.data(SystemToolsState(isExporting: true));
    try {
      final network = ref.read(networkCoreProvider);
      final responseData = await network.request('GET', endpoint);
      
      final String content = responseData is Map || responseData is List 
          ? responseData.toString() 
          : responseData as String;

      final directory = await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/$filename');
      await file.writeAsString(content);

      await Share.shareXFiles([XFile(file.path)], text: 'Arcturus Data Export');
      state = AsyncValue.data(SystemToolsState(lastMessage: successMessage));
    } catch (e) {
      state = AsyncValue.data(SystemToolsState(lastMessage: 'Export failed: $e'));
    }
  }

  Future<void> exportFullBackupFile() async {
    await _exportAndShare(
      '/backup', 
      'arcturus_backup_${DateTime.now().millisecondsSinceEpoch}.json', 
      'Backup ready for saving/sharing.'
    );
  }

  Future<void> exportInventoryCsv() async {
    await _exportAndShare(
      '/import-export/export/inventory.csv', 
      'arcturus_inventory_${DateTime.now().millisecondsSinceEpoch}.csv', 
      'CSV ready for saving/sharing.'
    );
  }

  Future<void> restoreFromFile() async {
    state = const AsyncValue.data(SystemToolsState(lastMessage: 'File restore is currently managed via Admin Web Panel.'));
  }

  Future<void> clearAllLocalData() async {
    state = const AsyncValue.data(SystemToolsState(lastMessage: 'Local wipe is deprecated in thin-client mode. Data persists on server.'));
  }
}

final systemToolsEngineProvider = AsyncNotifierProvider<SystemToolsEngine, SystemToolsState>(SystemToolsEngine.new);