// lib/features/analytics/application/flip_score_band_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_band_model.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_provider.dart';

final flipScoreBandsProvider = Provider<List<FlipScoreBandModel>>((ref) {
  final scores = ref.watch(flipScoresProvider);

  int elite = 0;
  int good = 0;
  int mid = 0;
  int weak = 0;

  for (final score in scores) {
    if (score.score >= 200) {
      elite++;
    } else if (score.score >= 100) {
      good++;
    } else if (score.score >= 30) {
      mid++;
    } else {
      weak++;
    }
  }

  return [
    FlipScoreBandModel(label: 'Elite', count: elite),
    FlipScoreBandModel(label: 'Good', count: good),
    FlipScoreBandModel(label: 'Mid', count: mid),
    FlipScoreBandModel(label: 'Weak', count: weak),
  ];
});
