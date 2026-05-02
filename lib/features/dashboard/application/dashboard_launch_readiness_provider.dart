import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_queue_status_summary_provider.dart';

class DashboardLaunchReadinessModel {
  final String label;
  final bool ready;

  const DashboardLaunchReadinessModel({
    required this.label,
    required this.ready,
  });
}

final dashboardLaunchReadinessProvider =
    Provider<DashboardLaunchReadinessModel>((ref) {
  final flows = ref.watch(dashboardFlowCountersProvider);
  final queues = ref.watch(dashboardQueueStatusSummaryProvider);
  final ready = flows.purchaseFlow >= 0;
  final label = queues.buyQueue > 0
      ? 'Ready to execute buys'
      : queues.sellQueue > 0
          ? 'Ready to execute sells'
          : queues.repriceQueue > 0
              ? 'Repricing available'
              : 'System idle but ready';
  return DashboardLaunchReadinessModel(
    label: label,
    ready: ready,
  );
});
