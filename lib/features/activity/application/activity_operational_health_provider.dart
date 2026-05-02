import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operational_health_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_stability_provider.dart';

final activityOperationalHealthProvider =
    Provider<ActivityOperationalHealthModel>((ref) {
  final discipline = ref.watch(activityDisciplineProvider);
  final stability = ref.watch(activityWeeklyStabilityProvider);
  final label = discipline.label == 'Activity discipline is strong' &&
          stability.label == 'Weekly stability is very strong'
      ? 'Operational health is strong'
      : discipline.label == 'Activity discipline is forming'
          ? 'Operational health is developing'
          : 'Operational health is unstable';

  return ActivityOperationalHealthModel(label: label);
});
