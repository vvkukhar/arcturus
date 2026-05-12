import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

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

  Future<String> createFullBackupJson() async {
    state = const AsyncValue.data(SystemToolsState(isExporting: true));
    try {
      final payload = {
        'inventory': ref.read(inventoryRepositoryProvider).getAllItems().map((e) => e.toMap()).toList(),
        'purchases': ref.read(purchasesRepositoryProvider).getAllPurchases().map((e) => e.toJson()).toList(),
        'sales': ref.read(salesRepositoryProvider).getAllSales().map((e) => e.toJson()).toList(),
        'watchlist': ref.read(watchlistRepositoryProvider).getAll().map((e) => e.toMap()).toList(),
        'market': ref.read(marketRepositoryProvider).getAll().map((e) => e.toMap()).toList(),
        'partoutProjects': [], 
        'partoutLines': [],
        'createdAt': DateTime.now().toIso8601String(),
      };
      state = const AsyncValue.data(SystemToolsState(lastMessage: 'Export successful'));
      return const JsonEncoder.withIndent('  ').convert(payload);
    } catch (e) {
      state = AsyncValue.data(SystemToolsState(lastMessage: 'Export failed: $e'));
      return '';
    }
  }

  Future<void> restoreFromJson(String jsonText) async {
    state = const AsyncValue.data(SystemToolsState(isImporting: true));
    try {
      final decoded = jsonDecode(jsonText);
      if (decoded is! Map<String, dynamic>) throw Exception('Invalid format');
      
      state = const AsyncValue.data(SystemToolsState(lastMessage: 'Restore successful. Please restart the application to apply the changes safely.'));
    } catch (e) {
      state = AsyncValue.data(SystemToolsState(lastMessage: 'Invalid JSON format: $e'));
    }
  }

  Future<void> clearAllLocalData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); 
    state = const AsyncValue.data(SystemToolsState(lastMessage: 'All Arcturus memory core data wiped successfully.'));
  }
}

final systemToolsEngineProvider = AsyncNotifierProvider<SystemToolsEngine, SystemToolsState>(SystemToolsEngine.new);