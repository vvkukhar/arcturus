import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/connectivity_service_provider.dart';

final dashboardOfflineBannerProvider = StreamProvider<bool>((ref) {
  final connectivity = ref.watch(connectivityServiceProvider);
  return connectivity.onlineStream.map((online) => !online);
});
