import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_momentum_model.dart';

final activityMomentumProvider = Provider<ActivityMomentumModel>((ref) {
  return const ActivityMomentumModel(
    label: 'Stable momentum',
  );
});