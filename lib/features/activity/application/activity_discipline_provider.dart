import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_momentum_provider.dart';

final activityDisciplineProvider = Provider<ActivityDisciplineModel>((ref) {
  final consistency = ref.watch(activityConsistencyProvider);
  final momentum = ref.watch(activityMomentumProvider);
  final label =
      consistency.activeDaysInLast7 >= 5 && momentum.label == 'Strong momentum'
          ? 'Activity discipline is strong'
          : consistency.activeDaysInLast7 >= 3
              ? 'Activity discipline is forming'
              : 'Activity discipline is inconsistent';

  return ActivityDisciplineModel(label: label);
});
