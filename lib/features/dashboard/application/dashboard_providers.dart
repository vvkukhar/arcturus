import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/dashboard_repository.dart';

final dashboardRepositoryTypedProvider = Provider<DashboardRepository>((ref) {
  return ref.read(dashboardRepositoryProvider);
});

final dashboardStatsProvider = Provider((ref) {
  return ref.read(dashboardRepositoryTypedProvider).getStats();
});

final dashboardBestDealsProvider = Provider<List<ItemModel>>((ref) {
  return ref.read(dashboardRepositoryTypedProvider).getBestDeals();
});

final dashboardStaleInventoryProvider = Provider<List<ItemModel>>((ref) {
  return ref.read(dashboardRepositoryTypedProvider).getStaleInventory();
});
