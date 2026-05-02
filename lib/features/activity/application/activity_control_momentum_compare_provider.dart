import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_control_momentum_compare_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_momentum_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_control_score_provider.dart';

final activityControlMomentumCompareProvider =
    Provider<ActivityControlMomentumCompareModel>((ref) {
  final control = ref.watch(activityWeeklyControlScoreProvider);
  final momentum = ref.watch(activityMomentumProvider);

  final label = control.score >= 70 && momentum.label == 'Strong momentum'
      ? 'control and momentum aligned'
      : control.score >= 45
          ? 'control leads momentum'
          : 'momentum is weaker than control';

  return ActivityControlMomentumCompareModel(
    label: label,
    controlScore: control.score,
    momentumLabel: momentum.label,
  );
});