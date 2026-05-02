import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_execution_summary_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_api_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_market_pulse_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_offline_banner_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_opportunities_block_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_priority_queue_api_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_realtime_bridge_provider.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_execution_summary_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_flow_shortcuts_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_live_backend_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_market_pulse_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_offline_banner.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_operator_health_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_operator_shortcuts_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_opportunities_block_card.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/dashboard_unresolved_match_card.dart';
import 'package:lego_trading_manager/features/operator/application/operator_health_summary_provider.dart';
import 'package:lego_trading_manager/features/operator/application/unresolved_summary_provider.dart';
import 'package:lego_trading_manager/features/source_health/application/source_health_summary_provider.dart';
import 'package:lego_trading_manager/features/source_health/presentation/widgets/source_health_summary_card.dart';
import 'package:lego_trading_manager/features/sync/application/dashboard_sync_summary_provider.dart';
import 'package:lego_trading_manager/features/sync/application/global_sync_state_provider.dart';
import 'package:lego_trading_manager/features/sync/application/sync_health_center_provider.dart';
import 'package:lego_trading_manager/features/sync/data/sync_api_repository_provider.dart';
import 'package:lego_trading_manager/features/sync/presentation/widgets/dashboard_sync_status_card.dart';
import 'package:lego_trading_manager/features/sync/presentation/widgets/global_sync_action_card.dart';
import 'package:lego_trading_manager/features/sync/presentation/widgets/sync_health_center_card.dart';

class DashboardLiveScreen extends ConsumerWidget {
  const DashboardLiveScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(dashboardRealtimeBridgeProvider);
    final executionSummary = ref.watch(dashboardExecutionSummaryProvider);
    final flowCounters = ref.watch(dashboardFlowCountersApiProvider);
    final priorityQueue = ref.watch(dashboardPriorityQueueApiProvider);
    final opportunitiesBlock = ref.watch(dashboardOpportunitiesBlockProvider);
    final marketPulse = ref.watch(dashboardMarketPulseProvider);
    final syncSummary = ref.watch(dashboardSyncSummaryProvider);
    final globalSyncState = ref.watch(globalSyncStateProvider);
    final sourceHealth = ref.watch(sourceHealthSummaryProvider);
    final unresolvedSummary = ref.watch(unresolvedSummaryProvider);
    final operatorHealth = ref.watch(operatorHealthSummaryProvider);
    final offlineBanner = ref.watch(dashboardOfflineBannerProvider);
    final syncHealthCenter = ref.watch(syncHealthCenterProvider);
    final syncRepository = ref.watch(syncApiRepositoryProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Live'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          offlineBanner.when(
            data: (offline) => offline
                ? const Padding(
                    padding: EdgeInsets.only(bottom: 16),
                    child: DashboardOfflineBanner(),
                  )
                : const SizedBox.shrink(),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
          DashboardFlowShortcutsCard(
            onOpenPurchase: () {
              Navigator.of(context).pushNamed(AppRouter.purchaseFlow);
            },
            onOpenReprice: () {
              Navigator.of(context).pushNamed(AppRouter.repriceFlow);
            },
            onOpenReview: () {
              Navigator.of(context).pushNamed(AppRouter.reviewFlow);
            },
          ),
          const SizedBox(height: 16),
          DashboardOperatorShortcutsCard(
            onOpenUnresolved: () {
              Navigator.of(context).pushNamed(AppRouter.unresolvedMatches);
            },
            onOpenSourceRuns: () {
              Navigator.of(context).pushNamed(AppRouter.sourceRuns);
            },
            onOpenSourceHealth: () {
              Navigator.of(context).pushNamed(AppRouter.sourceHealthDetails);
            },
            onOpenSyncErrors: () {
              Navigator.of(context).pushNamed(AppRouter.syncErrors);
            },
          ),
          const SizedBox(height: 16),
          syncHealthCenter.when(
            data: (data) => SyncHealthCenterCard(
              model: data,
              onOpenSyncQueue: () {
                Navigator.of(context).pushNamed(AppRouter.manualSyncQueue);
              },
              onOpenConflicts: () {
                Navigator.of(context).pushNamed(AppRouter.conflictQueue);
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Sync health error: $error'),
          ),
          const SizedBox(height: 16),
          executionSummary.when(
            data: (data) => DashboardExecutionSummaryCard(model: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Execution summary error: $error'),
          ),
          const SizedBox(height: 16),
          operatorHealth.when(
            data: (data) => DashboardOperatorHealthCard(model: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Operator health error: $error'),
          ),
          const SizedBox(height: 16),
          globalSyncState.when(
            data: (data) => GlobalSyncActionCard(
              state: data,
              onRefreshAll: () async {
                await syncRepository.refreshAll();
                ref.invalidate(globalSyncStateProvider);
                ref.invalidate(dashboardSyncSummaryProvider);
                ref.invalidate(dashboardFlowCountersApiProvider);
                ref.invalidate(dashboardPriorityQueueApiProvider);
                ref.invalidate(dashboardMarketPulseProvider);
                ref.invalidate(dashboardOpportunitiesBlockProvider);
                ref.invalidate(sourceHealthSummaryProvider);
                ref.invalidate(unresolvedSummaryProvider);
                ref.invalidate(operatorHealthSummaryProvider);
                ref.invalidate(dashboardExecutionSummaryProvider);
                ref.invalidate(syncHealthCenterProvider);
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Global sync error: $error'),
          ),
          const SizedBox(height: 16),
          syncSummary.when(
            data: (data) => DashboardSyncStatusCard(model: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Sync summary error: $error'),
          ),
          const SizedBox(height: 16),
          unresolvedSummary.when(
            data: (data) => DashboardUnresolvedMatchCard(model: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Unresolved summary error: $error'),
          ),
          const SizedBox(height: 16),
          sourceHealth.when(
            data: (data) => SourceHealthSummaryCard(items: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Source health error: $error'),
          ),
          const SizedBox(height: 16),
          marketPulse.when(
            data: (data) => DashboardMarketPulseCard(
              model: data,
              onOpenBuy: () {
                Navigator.of(context).pushNamed(AppRouter.bestBuy);
              },
              onOpenSell: () {
                Navigator.of(context).pushNamed(AppRouter.bestSell);
              },
              onOpenReprice: () {
                Navigator.of(context).pushNamed(AppRouter.bestReprice);
              },
              onOpenReview: () {
                Navigator.of(context).pushNamed(AppRouter.bestReview);
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Market pulse error: $error'),
          ),
          const SizedBox(height: 16),
          opportunitiesBlock.when(
            data: (data) => DashboardOpportunitiesBlockCard(
              model: data,
              onOpenBuy: () {
                Navigator.of(context).pushNamed(AppRouter.bestBuy);
              },
              onOpenSell: () {
                Navigator.of(context).pushNamed(AppRouter.bestSell);
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Opportunities error: $error'),
          ),
          const SizedBox(height: 16),
          flowCounters.when(
            data: (data) => DashboardLiveBackendCard(model: data),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Flow counters error: $error'),
          ),
          const SizedBox(height: 16),
          priorityQueue.when(
            data: (items) {
              if (items.isEmpty) {
                return const Card(
                  child: Padding(
                    padding: EdgeInsets.all(14),
                    child: Text('No backend priority items'),
                  ),
                );
              }
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Backend Priority Queue',
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ...items.take(10).map(
                            (item) => Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      '${item.action} • ${item.reasonPrimary}',
                                    ),
                                  ),
                                  Text(
                                    item.score.toStringAsFixed(0),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                    ],
                  ),
                ),
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Text('Priority queue error: $error'),
          ),
        ],
      ),
    );
  }
}
