import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class MarketEngineState {
  final List<dynamic> snapshots;
  final List<Map<String, dynamic>> sources;
  final bool isLoading;

  const MarketEngineState({
    required this.snapshots,
    required this.sources,
    this.isLoading = false,
  });
}

class MarketEngine extends AsyncNotifier<MarketEngineState> {
  @override
  Future<MarketEngineState> build() async {
    return _fetchData();
  }

  Future<MarketEngineState> _fetchData() async {
    final network = ref.read(networkCoreProvider);
    
    if (!await network.isOnline()) {
      return const MarketEngineState(snapshots: [], sources: []);
    }

    try {
      final sourcesRes = await network.request('GET', '/scanner/sources');
      final sources = (sourcesRes as List).map((e) => Map<String, dynamic>.from(e)).toList();
      
      return MarketEngineState(snapshots: [], sources: sources);
    } catch (e) {
      debugPrint('Market fetch error: $e'); // Фікс: debugPrint замість print
      return const MarketEngineState(snapshots: [], sources: []);
    }
  }

  Future<void> triggerScraper(String sourceCode) async {
    final network = ref.read(networkCoreProvider);
    try {
      await network.request('POST', '/scanner/jobs', body: {
        'sourceCode': sourceCode,
        'query': '',
      });
      ref.invalidateSelf();
    } catch (e) {
      throw Exception('Failed to trigger scraper: $e');
    }
  }
}

final marketEngineProvider = AsyncNotifierProvider<MarketEngine, MarketEngineState>(MarketEngine.new);