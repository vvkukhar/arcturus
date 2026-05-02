import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_consistency_ratio_model.dart';

final activityWeeklyConsistencyRatioProvider =
    Provider<ActivityWeeklyConsistencyRatioModel>((ref) {
  final consistency = ref.watch(activityConsistencyProvider);

  final double ratio = consistency.totalDaysTracked == 0
      ? 0.0
      : consistency.activeDaysInLast7 / consistency.totalDaysTracked;

  final label = ratio >= 0.7
      ? 'very focused recent activity'
      : ratio >= 0.4
          ? 'balanced recent activity'
          : 'diffused recent activity';

  return ActivityWeeklyConsistencyRatioModel(
    ratio: ratio,
    label: label,
  );
});