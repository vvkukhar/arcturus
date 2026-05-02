import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_action_center_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_provider.dart';

class HomeLaunchBlockModel {
  final String title;
  final String subtitle;

  const HomeLaunchBlockModel({
    required this.title,
    required this.subtitle,
  });
}

final homeLaunchBlockProvider = Provider<HomeLaunchBlockModel>((ref) {
  final actionCenter = ref.watch(dashboardActionCenterProvider);
  final flowCounters = ref.watch(dashboardFlowCountersProvider);
  final title = actionCenter.headline;
  final subtitle =
      '${actionCenter.subline} • Purchase ${flowCounters.purchaseFlow} • Reprice ${flowCounters.repriceFlow}';
  return HomeLaunchBlockModel(
    title: title,
    subtitle: subtitle,
  );
});
