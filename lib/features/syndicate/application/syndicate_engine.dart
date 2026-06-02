import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class SyndicateEngine extends AsyncNotifier<Map<String, dynamic>> {
  @override
  Future<Map<String, dynamic>> build() async {
    final network = ref.read(networkCoreProvider);
    try {
      final res = await network.request('GET', '/syndicate/dashboard');
      return res is Map<String, dynamic> ? res : {};
    } catch (e) {
      return {};
    }
  }

  Future<void> generateCode() async {
    final network = ref.read(networkCoreProvider);
    await network.request('POST', '/syndicate/code/generate');
    ref.invalidateSelf();
  }

  void copyCode(String code) {
    Clipboard.setData(ClipboardData(text: 'https://arcturus.store/register?ref=$code'));
  }
}

final syndicateEngineProvider = AsyncNotifierProvider<SyndicateEngine, Map<String, dynamic>>(SyndicateEngine.new);