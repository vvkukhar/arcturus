import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
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
    inventory: ref.watch(inventoryRepositoryProvider).getAllItems(),
    watchlist: ref.watch(watchlistRepositoryProvider).getAll(),
  );
});