import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_cadence_stability_compare_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operating_cadence_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_stability_provider.dart';

final activityCadenceStabilityCompareProvider =
    Provider<ActivityCadenceStabilityCompareModel>((ref) {
  final cadence = ref.watch(activityOperatingCadenceProvider);
  final stability = ref.watch(activityWeeklyStabilityProvider);

  final label = cadence.label.contains('strong') &&
          stability.label.contains('very strong')
      ? 'cadence and stability aligned'
      : cadence.label.contains('stable')
          ? 'cadence leads stability'
          : 'stability is weaker than cadence';

  return ActivityCadenceStabilityCompareModel(
    label: label,
    weeklyActiveDays: cadence.weeklyActiveDays,
    stabilityLabel: stability.label,
  );
});