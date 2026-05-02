import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/realtime/realtime_service_provider.dart';
import 'package:lego_trading_manager/core/realtime/reconnect_recovery_service_provider.dart';
import 'package:lego_trading_manager/core/sync/background_sync_service_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_execution_summary_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_api_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_market_pulse_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_opportunities_block_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_priority_queue_api_provider.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/review_flow_provider.dart';
import 'package:lego_trading_manager/features/operator/application/operator_health_summary_provider.dart';
import 'package:lego_trading_manager/features/operator/application/unresolved_summary_provider.dart';
import 'package:lego_trading_manager/features/source_health/application/source_health_summary_provider.dart';
import 'package:lego_trading_manager/features/sync/application/dashboard_sync_summary_provider.dart';
import 'package:lego_trading_manager/features/sync/application/global_sync_state_provider.dart';

final dashboardRealtimeBridgeProvider = Provider<StreamSubscription>((ref) {
  final realtime = ref.watch(realtimeServiceProvider);
  final recovery = ref.watch(reconnectRecoveryServiceProvider);
  final backgroundSync = ref.watch(backgroundSyncServiceProvider);

  realtime.connect();

  void invalidateAll() {
    ref.invalidate(dashboardExecutionSummaryProvider);
    ref.invalidate(dashboardFlowCountersApiProvider);
    ref.invalidate(dashboardMarketPulseProvider);
    ref.invalidate(dashboardOpportunitiesBlockProvider);
    ref.invalidate(dashboardPriorityQueueApiProvider);
    ref.invalidate(dashboardSyncSummaryProvider);
    ref.invalidate(globalSyncStateProvider);
    ref.invalidate(unresolvedSummaryProvider);
    ref.invalidate(operatorHealthSummaryProvider);
    ref.invalidate(sourceHealthSummaryProvider);
    ref.invalidate(purchaseFlowProvider);
    ref.invalidate(repriceFlowProvider);
    ref.invalidate(reviewFlowProvider);
  }

  recovery.start(
    onRecovered: () async {
      await backgroundSync.flush();
      invalidateAll();
    },
  );

  final sub = realtime.events.listen((event) {
    if (event.type == 'dashboard_refresh') {
      invalidateAll();
    }

    if (event.type == 'flow_refresh') {
      ref.invalidate(purchaseFlowProvider);
      ref.invalidate(repriceFlowProvider);
      ref.invalidate(reviewFlowProvider);
      ref.invalidate(dashboardExecutionSummaryProvider);
      ref.invalidate(dashboardFlowCountersApiProvider);
    }

    if (event.type == 'opportunity_refresh') {
      ref.invalidate(dashboardMarketPulseProvider);
      ref.invalidate(dashboardOpportunitiesBlockProvider);
      ref.invalidate(dashboardPriorityQueueApiProvider);
    }
  });

  ref.onDispose(sub.cancel);
  return sub;
});