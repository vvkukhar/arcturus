import 'dart:convert';
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

    if (isOnline) Future.microtask(() => _processQueue());
  }

  Future<void> _processQueue() async {
    if (_isProcessing) return;
    _isProcessing = true;

    final prefs = await SharedPreferences.getInstance();
    final network = ref.read(networkCoreProvider);
    var rawQueue = prefs.getStringList(_queueKey) ?? [];
    final successfulIds = <String>{};

    for (final rawMutation in rawQueue) {
      try {
        final mutation = jsonDecode(rawMutation);
        await network.request(
          mutation['method'],
          mutation['endpoint'],
          body: mutation['payload'],
        );
        successfulIds.add(mutation['id']);
      } catch (e) {
        if (e.toString().contains('UNAUTHORIZED')) {
          break; 
        }
      }
    }

    if (successfulIds.isNotEmpty) {
      rawQueue = prefs.getStringList(_queueKey) ?? [];
      final updatedQueue = rawQueue.where((raw) {
        final id = jsonDecode(raw)['id'];
        return !successfulIds.contains(id);
      }).toList();
      
      await prefs.setStringList(_queueKey, updatedQueue);
      if (state.value != null) {
        state = AsyncValue.data(SyncEngineState(isOnline: true, pendingMutations: updatedQueue.length));
      }
    }
    _isProcessing = false;
  }
}

final syncEngineProvider = AsyncNotifierProvider<SyncEngine, SyncEngineState>(SyncEngine.new);