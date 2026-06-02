import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class MarketingEngine extends Notifier<bool> {
  @override
  bool build() => false;

  Future<void> dispatchSmm() async {
    if (state) return;
    state = true;
    try {
      final network = ref.read(networkCoreProvider);
      await network.request('POST', '/queue/marketing/smm');
    } finally {
      state = false;
    }
  }

  Future<void> dispatchLtv() async {
    if (state) return;
    state = true;
    try {
      final network = ref.read(networkCoreProvider);
      await network.request('POST', '/queue/marketing/ltv');
    } finally {
      state = false;
    }
  }
}

final marketingEngineProvider = NotifierProvider<MarketingEngine, bool>(MarketingEngine.new);