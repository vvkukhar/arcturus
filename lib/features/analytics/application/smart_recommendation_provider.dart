// lib/features/analytics/application/smart_recommendation_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_model.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_service.dart';

final smartRecommendationServiceProvider =
    Provider<SmartRecommendationService>((ref) {
  return SmartRecommendationService();
});

final smartRecommendationsProvider =
    Provider<List<SmartRecommendationModel>>((ref) {
  final service = ref.watch(smartRecommendationServiceProvider);
  return service.build(
    inventory: InventoryRepository().getAllItems(),
    watchlist: WatchlistRepository().getAll(),
  );
});
