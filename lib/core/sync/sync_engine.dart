import 'dart:convert';
import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/core/network/network_core.dart';
import 'package:lego_trading_manager/core/config/api_config.dart';

class SyncEngineState {
  final bool isOnline;
  final int pendingMutations;
  const SyncEngineState({required this.isOnline, required this.pendingMutations});
}

final networkCoreProvider = Provider((ref) => NetworkCore(baseUrl: ApiConfig.baseUrl));

class SyncEngine extends AsyncNotifier<SyncEngineState> {
  static const String _queueKey = 'arcturus_sync_queue';
  bool _isProcessing = false;
  Completer<void>? _syncLock;

  @override
  Future<SyncEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    final isOnline = await network.isOnline();
    
    if (isOnline) await network.initSocket();

    final prefs = await SharedPreferences.getInstance();
    final rawQueue = prefs.getStringList(_queueKey) ?? [];
    
    if (isOnline && rawQueue.isNotEmpty) {
      Future.microtask(() => _processQueue());
    }
    
    return SyncEngineState(isOnline: isOnline, pendingMutations: rawQueue.length);
  }

  void setOfflineMode() {
    final currentPending = state.valueOrNull?.pendingMutations ?? 0;
    state = AsyncValue.data(SyncEngineState(isOnline: false, pendingMutations: currentPending));
  }

  Future<void> enqueueMutation(String type, String endpoint, String method, Map<String, dynamic> payload) async {
    final prefs = await SharedPreferences.getInstance();
    final rawQueue = prefs.getStringList(_queueKey) ?? [];
    
    final mutation = jsonEncode({
      'id': DateTime.now().microsecondsSinceEpoch.toString(),
      'type': type,
      'endpoint': endpoint,
      'method': method,
      'payload': payload,
      'timestamp': DateTime.now().toIso8601String(),
    });
    
    rawQueue.add(mutation);
    await prefs.setStringList(_queueKey, rawQueue);
    
    final isOnline = await ref.read(networkCoreProvider).isOnline();
    state = AsyncValue.data(SyncEngineState(isOnline: isOnline, pendingMutations: rawQueue.length));

    if (isOnline) {
      Future.microtask(() => _processQueue());
    }
  }

  Future<void> _processQueue() async {
    if (_isProcessing) {
      if (_syncLock != null) await _syncLock!.future;
      return;
    }
    
    _isProcessing = true;
    _syncLock = Completer<void>();

    try {
      final prefs = await SharedPreferences.getInstance();
      final network = ref.read(networkCoreProvider);
      
      while (true) {
        final rawQueue = prefs.getStringList(_queueKey) ?? [];
        if (rawQueue.isEmpty) break;

        final currentMutationRaw = rawQueue.first;
        final mutation = jsonDecode(currentMutationRaw);

        try {
          await network.request(
            mutation['method'],
            mutation['endpoint'],
            body: mutation['payload'],
            retries: 0,
          );
          
          final freshQueue = prefs.getStringList(_queueKey) ?? [];
          freshQueue.removeWhere((item) => jsonDecode(item)['id'] == mutation['id']);
          await prefs.setStringList(_queueKey, freshQueue);
          
          if (state.value != null) {
            state = AsyncValue.data(SyncEngineState(isOnline: true, pendingMutations: freshQueue.length));
          }
        } catch (e) {
          if (e.toString().contains('Unauthorized') || e.toString().contains('Status 5')) {
            break;
          } else {
            final freshQueue = prefs.getStringList(_queueKey) ?? [];
            freshQueue.removeWhere((item) => jsonDecode(item)['id'] == mutation['id']);
            await prefs.setStringList(_queueKey, freshQueue);
          }
        }
      }
    } finally {
      _isProcessing = false;
      _syncLock?.complete();
      _syncLock = null;
    }
  }
}

final syncEngineProvider = AsyncNotifierProvider<SyncEngine, SyncEngineState>(SyncEngine.new);