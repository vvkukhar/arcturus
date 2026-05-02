import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_model.dart';

final activityConsistencyProvider = Provider<ActivityConsistencyModel>((ref) {
  return const ActivityConsistencyModel(
    activeDaysInLast7: 4,
    totalDaysTracked: 10,
    label: 'Moderate consistency',
  );
});