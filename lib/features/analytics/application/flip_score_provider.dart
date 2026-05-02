// lib/features/analytics/application/flip_score_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_model.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_service.dart';

final flipScoreServiceProvider = Provider<FlipScoreService>((ref) {
  return FlipScoreService();
});

final flipScoresProvider = Provider<List<FlipScoreModel>>((ref) {
  final service = ref.watch(flipScoreServiceProvider);
  final items = InventoryRepository().getAllItems();

  final result = items.map(service.build).toList();
  result.sort((a, b) => b.score.compareTo(a.score));
  return result;
});
