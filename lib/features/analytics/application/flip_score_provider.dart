import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_model.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_service.dart';

final flipScoreServiceProvider = Provider<FlipScoreService>((ref) {
  return FlipScoreService();
});

final flipScoresProvider = Provider<List<FlipScoreModel>>((ref) {
  final service = ref.watch(flipScoreServiceProvider);
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  final result = items.map(service.build).toList();
  result.sort((a, b) => b.score.compareTo(a.score));
  return result;
});