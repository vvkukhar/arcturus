import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';

class MarketEngineState {
  final List<MarketSnapshotModel> snapshots;
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
      // 1. Тягнемо зведену інформацію про джерела (скрапери)
      final sourcesRes = await network.request('GET', '/scanner/sources');
      final sources = (sourcesRes as List).map((e) => Map<String, dynamic>.from(e)).toList();

      // Оскільки у нас поки немає прямого роуту для списку ВСІХ снапшотів,
      // ми можемо симулювати їх, витягуючи зі збережених на бекенді (через дашборд або інвентар)
      // Але для чистоти, давай просто покажемо статус скраперів, бо це найважливіше для старту.
      
      return MarketEngineState(
        snapshots: [], // Поки пусто, додамо деталі пізніше
        sources: sources,
      );
    } catch (e) {
      print('Market fetch error: $e');
      return const MarketEngineState(snapshots: [], sources: []);
    }
  }

  Future<void> triggerScraper(String sourceCode) async {
    final network = ref.read(networkCoreProvider);
    try {
      // Запускаємо джобу скрапера на бекенді
      await network.request('POST', '/scanner/jobs', body: {
        'sourceCode': sourceCode,
        'query': '', // Порожній запит означає, що він пройдеться по всьому Watchlist (так працюють наші скрапери)
      });
      // Оновлюємо стан, щоб показати, що щось пішло
      ref.invalidateSelf();
    } catch (e) {
      throw Exception('Failed to trigger scraper: $e');
    }
  }
}

final marketEngineProvider = AsyncNotifierProvider<MarketEngine, MarketEngineState>(MarketEngine.new);