import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_replay_action_model.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

final activityReplayProvider = Provider<List<ActivityReplayActionModel>>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? const [];

  return items
      .map(
        (e) => ActivityReplayActionModel(
          title: e.title,
          subtitle: e.subtitle,
          type: e.type,
        ),
      )
      .toList();
});
