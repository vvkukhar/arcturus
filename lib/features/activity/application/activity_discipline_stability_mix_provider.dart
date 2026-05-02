import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_stability_index_provider.dart';

class ActivityDisciplineStabilityMixModel {
  final double score;
  final String label;

  const ActivityDisciplineStabilityMixModel({
    required this.score,
    required this.label,
  });
}

final activityDisciplineStabilityMixProvider =
    Provider<ActivityDisciplineStabilityMixModel>((ref) {
  final discipline = ref.watch(activityDisciplineProvider);
  final stability = ref.watch(activityStabilityIndexProvider);

  double disciplineScore = 0;
  if (discipline.label == 'Activity discipline is strong') {
    disciplineScore = 90;
  } else if (discipline.label == 'Activity discipline is forming') {
    disciplineScore = 60;
  } else {
    disciplineScore = 25;
  }

  double score = (disciplineScore * 0.45) + (stability.score * 0.55);
  final label = score >= 75
      ? 'strong discipline-stability mix'
      : score >= 50
          ? 'moderate discipline-stability mix'
          : 'weak discipline-stability mix';

  return ActivityDisciplineStabilityMixModel(
    score: score,
    label: label,
  );
});
