import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/connectivity_service_provider.dart';
import 'package:lego_trading_manager/core/sync/background_sync_service_provider.dart';

final backgroundFetchTriggerProvider = FutureProvider<void>((ref) async {
  final connectivity = ref.watch(connectivityServiceProvider);
  final backgroundSync = ref.watch(backgroundSyncServiceProvider);
  final online = await connectivity.isOnline();
  if (!online) {
    return;
  }
  await backgroundSync.flush();
});
