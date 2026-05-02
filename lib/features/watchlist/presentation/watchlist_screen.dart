import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/settings/application/save_action_report_flow_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_allocation_stability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_available_cash_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_durability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_balance_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_maturity_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_item_by_id_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_label_by_id_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_create_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_action_confidence_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_affordability_badge_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_affordability_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_batch_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_cash_warning_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_commit_hint_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_hint_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_pressure_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_next_best_action_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_profitability_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_readiness_score_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_risk_reward_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_selection_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_selection_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_smart_rank_label_by_id_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_smart_rank_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_ui_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_visible_items_provider.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/add_watchlist_item_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/buy_queue_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/purchase_flow_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_item_details_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_allocation_stability_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_auto_buy_cash_compare_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_auto_buy_simulation_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_available_cash_input_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_capital_discipline_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_card_v2.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_commit_durability_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_commit_stability_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_empty_state.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_balance_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_discipline_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_maturity_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_filter_sheet.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_header_actions_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_card_v2.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_explainer_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_action_confidence_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_actionable_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_affordability_badge.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_affordability_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_batch_summary_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_buy_power_ratio_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_cash_warning_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_commit_hint_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_execution_hint_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_execution_pressure_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_next_best_action_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_pressure_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_profitability_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_readiness_score_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_risk_reward_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_select_all_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_summary_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_batch_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_search_field.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_section_title.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_smart_rank_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_sort_dropdown.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_summary_bar.dart';

class WatchlistScreen extends ConsumerStatefulWidget {
  const WatchlistScreen({super.key});

  @override
  ConsumerState<WatchlistScreen> createState() => _WatchlistScreenState();
}

class _WatchlistScreenState extends ConsumerState<WatchlistScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(watchlistUiControllerProvider).query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _openAdd() async {
    final result = await Navigator.of(context).push<WatchlistItemModel>(
      MaterialPageRoute(
        builder: (_) => const AddWatchlistItemScreen(),
      ),
    );

    if (result == null) return;
    ref.read(watchlistControllerProvider.notifier).addItem(result);
  }

  Future<void> _openDetails(WatchlistItemModel item) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => WatchlistItemDetailsScreen(item: item),
      ),
    );

    if (result == null) return;

    if (result['deleted'] == true) {
      final id = result['id'] as String?;
      if (id != null) {
        ref.read(watchlistControllerProvider.notifier).deleteItem(id);
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Watchlist item deleted')),
      );
      return;
    }

    final updated = result['updated'] as WatchlistItemModel?;
    if (updated != null) {
      ref.read(watchlistControllerProvider.notifier).updateItem(updated);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Watchlist item updated')),
      );
    }
  }

  Future<void> _createPurchaseFromWatchlist(WatchlistItemModel item) async {
    final result = ref.read(watchlistPurchaseCreateProvider).build(item);

    ref.read(inventoryControllerProvider.notifier).addItem(result.item);
    ref.read(purchasesControllerProvider.notifier).addPurchase(result.purchase);
    ref.read(watchlistControllerProvider.notifier).updateItem(
          item.copyWith(isActive: false),
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Purchase created: ${item.title}')),
    );
  }

  Future<void> _saveReportForItem(WatchlistItemModel item) async {
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: 'Watchlist Item Review',
          initialNote:
              'Reviewed ${item.title} | desired=${item.desiredBuyPrice.toStringAsFixed(2)} | max=${item.maxBuyPrice.toStringAsFixed(2)}',
        );

    if (result == null) return;

    await ref.read(actionReportHelperProvider).save(
          title: result['title'] ?? 'Watchlist Item Review',
          note: result['note'] ?? '',
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Watchlist report saved')),
    );
  }

  Future<void> _openFilters() async {
    final state = ref.read(watchlistUiControllerProvider);

    final result = await showModalBottomSheet<WatchlistFilterModel>(
      context: context,
      isScrollControlled: true,
      builder: (_) => WatchlistFilterSheet(initialFilter: state.filter),
    );

    if (result == null) return;

    ref.read(watchlistUiControllerProvider.notifier).setFilter(result);
    ref.read(watchlistControllerProvider.notifier).setFilter(result);
  }

  void _syncSearch(String value) {
    ref.read(watchlistUiControllerProvider.notifier).search(value);
    ref.read(watchlistControllerProvider.notifier).search(value);
  }

  void _syncSort(WatchlistSortOption value) {
    ref.read(watchlistUiControllerProvider.notifier).setSort(value);
    ref.read(watchlistControllerProvider.notifier).setSort(value);
  }

  Future<void> _buySelectedReviewQueue() async {
    final reviewQueue = ref.read(watchlistReviewQueueProvider);
    final selected = ref.read(watchlistReviewQueueSelectionProvider);

    for (final item in reviewQueue) {
      if (!selected.contains(item.id)) continue;
      await _createPurchaseFromWatchlist(item);
    }

    ref.read(watchlistReviewQueueSelectionProvider.notifier).clear();
  }

  void _activateSelected() {
    final selected = ref.read(watchlistSelectionControllerProvider);
    ref.read(watchlistControllerProvider.notifier).activateMany(selected);
    ref.read(watchlistSelectionControllerProvider.notifier).clear();
  }

  void _deactivateSelected() {
    final selected = ref.read(watchlistSelectionControllerProvider);
    ref.read(watchlistControllerProvider.notifier).deactivateMany(selected);
    ref.read(watchlistSelectionControllerProvider.notifier).clear();
  }

  Future<void> _deleteSelected() async {
    final selected = ref.read(watchlistSelectionControllerProvider);
    if (selected.isEmpty) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete selected items'),
        content: Text('Delete ${selected.length} selected watchlist items?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    ref.read(watchlistControllerProvider.notifier).deleteMany(selected);
    ref.read(watchlistSelectionControllerProvider.notifier).clear();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(watchlistControllerProvider);
    final allItems = state.allItems;
    final items = ref.watch(watchlistVisibleItemsProvider);
    final selected = ref.watch(watchlistSelectionControllerProvider);

    final opportunities = ref.watch(watchlistOpportunitiesProvider);
    final priorities = ref.watch(watchlistPriorityProvider);
    final ui = ref.watch(watchlistUiControllerProvider);

    final reviewQueue = ref.watch(watchlistReviewQueueProvider);
    final reviewQueueSelected = ref.watch(watchlistReviewQueueSelectionProvider);

    final queueSummary = ref.watch(watchlistQueueSummaryProvider);
    final autoBuySimulation = ref.watch(watchlistAutoBuySimulationProvider);
    final availableCash = ref.watch(watchlistAvailableCashProvider);
    final autoBuyCashCompare = ref.watch(watchlistAutoBuyCashCompareProvider);
    final queueCashWarning = ref.watch(watchlistQueueCashWarningProvider);
    final queueProfitability =
        ref.watch(watchlistQueueProfitabilitySummaryProvider);
    final smartRank = ref.watch(watchlistSmartRankProvider);
    final affordabilityBadge = ref.watch(watchlistQueueAffordabilityBadgeProvider);
    final affordabilitySummary =
        ref.watch(watchlistQueueAffordabilitySummaryProvider);
    final queueBatchSummary = ref.watch(watchlistQueueBatchSummaryProvider);
    final queueBuyPowerRatio = ref.watch(watchlistQueueBuyPowerRatioProvider);
    final queuePressure = ref.watch(watchlistQueuePressureProvider);
    final actionableQueueSummary =
        ref.watch(watchlistQueueActionableSummaryProvider);
    final queueExecutionHint = ref.watch(watchlistQueueExecutionHintProvider);
    final queueExecutionPressureSummary =
        ref.watch(watchlistQueueExecutionPressureSummaryProvider);
    final nextBestAction = ref.watch(watchlistQueueNextBestActionProvider);
    final queueReadiness = ref.watch(watchlistQueueReadinessScoreProvider);
    final queueActionConfidence = ref.watch(watchlistQueueActionConfidenceProvider);
    final queueCommitHint = ref.watch(watchlistQueueCommitHintProvider);
    final queueRiskReward = ref.watch(watchlistQueueRiskRewardProvider);
    final capitalDiscipline = ref.watch(watchlistCapitalDisciplineProvider);
    final executionDiscipline = ref.watch(watchlistExecutionDisciplineProvider);
    final commitStability = ref.watch(watchlistCommitStabilityProvider);
    final executionMaturity = ref.watch(watchlistExecutionMaturityProvider);
    final executionBalance = ref.watch(watchlistExecutionBalanceProvider);
    final commitDurability = ref.watch(watchlistCommitDurabilityProvider);
    final allocationStability = ref.watch(watchlistAllocationStabilityProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Watchlist'),
        actions: [
          IconButton(
            onPressed: _openFilters,
            icon: const Icon(Icons.filter_alt_outlined),
          ),
          IconButton(
            onPressed: _openAdd,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            WatchlistSearchField(
              controller: _searchController,
              onChanged: _syncSearch,
              onClear: () {
                _searchController.clear();
                _syncSearch('');
              },
            ),
            const SizedBox(height: 12),
            WatchlistSortDropdown(
              value: ui.sort,
              onChanged: (value) {
                if (value == null) return;
                _syncSort(value);
              },
            ),
            const SizedBox(height: 12),
            WatchlistSummaryBar(
              visibleCount: items.length,
              totalCount: allItems.length,
              sortLabel: ui.sort.label,
            ),
            const SizedBox(height: 12),
            WatchlistBulkActionBar(
              selectedCount: selected.length,
              onActivate: _activateSelected,
              onDeactivate: _deactivateSelected,
              onDelete: _deleteSelected,
              onClear: () {
                ref.read(watchlistSelectionControllerProvider.notifier).clear();
              },
            ),
            const SizedBox(height: 8),
            Expanded(
              child: allItems.isEmpty
                  ? WatchlistEmptyState(onAdd: _openAdd)
                  : ListView(
                      children: [
                        WatchlistHeaderActionsCard(
                          onOpenOpportunities: () {
                            Navigator.of(context).pushNamed(
                              AppRouter.opportunityCenter,
                            );
                          },
                          onOpenBuyQueue: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => const BuyQueueScreen(),
                              ),
                            );
                          },
                          onOpenPurchaseFlow: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => const PurchaseFlowScreen(),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 14),
                        WatchlistAvailableCashInputCard(
                          value: availableCash,
                          onChanged: (value) {
                            ref
                                .read(watchlistAvailableCashProvider.notifier)
                                .state = value;
                          },
                        ),
                        const SizedBox(height: 14),
                        WatchlistSectionTitle(
                          title: 'Queue Control',
                          subtitle: 'Cash pressure, readiness and execution state.',
                        ),
                        WatchlistAutoBuySimulationCard(model: autoBuySimulation),
                        const SizedBox(height: 12),
                        WatchlistAutoBuyCashCompareCard(
                          model: autoBuyCashCompare,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueCashWarningCard(model: queueCashWarning),
                        const SizedBox(height: 12),
                        WatchlistQueueSummaryBar(model: queueSummary),
                        const SizedBox(height: 12),
                        WatchlistQueueProfitabilitySummaryCard(
                          model: queueProfitability,
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Text(
                              'Queue affordability',
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                            const SizedBox(width: 8),
                            WatchlistQueueAffordabilityBadge(
                              label: affordabilityBadge,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueAffordabilitySummaryCard(
                          model: affordabilitySummary,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueBuyPowerRatioCard(
                          model: queueBuyPowerRatio,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueuePressureCard(model: queuePressure),
                        const SizedBox(height: 16),
                        WatchlistSectionTitle(
                          title: 'Smart Ranking',
                          subtitle: 'Top targets ranked by gap, spread and activity.',
                        ),
                        WatchlistSmartRankCard(items: smartRank),
                        const SizedBox(height: 16),
                        WatchlistSectionTitle(
                          title: 'Review Queue',
                          subtitle: 'Actionable items under max buy price.',
                        ),
                        WatchlistQueueSelectAllBar(
                          total: reviewQueue.length,
                          onSelectAll: () {
                            final ids = reviewQueue.map((e) => e.id);
                            ref
                                .read(
                                  watchlistReviewQueueSelectionProvider.notifier,
                                )
                                .selectAll(ids);
                          },
                          onClear: () {
                            ref
                                .read(
                                  watchlistReviewQueueSelectionProvider.notifier,
                                )
                                .clear();
                          },
                        ),
                        const SizedBox(height: 8),
                        WatchlistQueueBatchSummaryBanner(
                          model: queueBatchSummary,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueActionableSummaryCard(
                          model: actionableQueueSummary,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueExecutionHintCard(
                          model: queueExecutionHint,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueExecutionPressureSummaryCard(
                          model: queueExecutionPressureSummary,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueNextBestActionBanner(
                          model: nextBestAction,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueReadinessScoreCard(model: queueReadiness),
                        const SizedBox(height: 12),
                        WatchlistQueueActionConfidenceCard(
                          model: queueActionConfidence,
                        ),
                        const SizedBox(height: 12),
                        WatchlistQueueCommitHintBanner(model: queueCommitHint),
                        const SizedBox(height: 12),
                        WatchlistQueueRiskRewardBanner(model: queueRiskReward),
                        const SizedBox(height: 12),
                        WatchlistReviewQueueBatchBar(
                          selectedCount: reviewQueueSelected.length,
                          onBuySelected: _buySelectedReviewQueue,
                          onClear: () {
                            ref
                                .read(
                                  watchlistReviewQueueSelectionProvider.notifier,
                                )
                                .clear();
                          },
                        ),
                        const SizedBox(height: 12),
                        WatchlistReviewQueueCard(
                          items: reviewQueue,
                          selectedIds: reviewQueueSelected,
                          onToggleSelected: (id) {
                            ref
                                .read(
                                  watchlistReviewQueueSelectionProvider.notifier,
                                )
                                .toggle(id);
                          },
                          onOpenWatchlist: () {},
                          onOpenOpportunities: () {
                            Navigator.of(context).pushNamed(
                              AppRouter.opportunityCenter,
                            );
                          },
                          onOpen: _openDetails,
                          onQuickBuy: _createPurchaseFromWatchlist,
                        ),
                        const SizedBox(height: 16),
                        WatchlistSectionTitle(
                          title: 'Execution Quality',
                          subtitle: 'Discipline, maturity and allocation stability.',
                        ),
                        WatchlistCommitStabilityBanner(model: commitStability),
                        const SizedBox(height: 12),
                        WatchlistExecutionMaturityCard(
                          model: executionMaturity,
                        ),
                        const SizedBox(height: 12),
                        WatchlistCapitalDisciplineBanner(
                          model: capitalDiscipline,
                        ),
                        const SizedBox(height: 12),
                        WatchlistExecutionDisciplineBanner(
                          model: executionDiscipline,
                        ),
                        const SizedBox(height: 12),
                        WatchlistExecutionBalanceCard(model: executionBalance),
                        const SizedBox(height: 12),
                        WatchlistCommitDurabilityCard(model: commitDurability),
                        const SizedBox(height: 12),
                        WatchlistAllocationStabilityCard(
                          model: allocationStability,
                        ),
                        const SizedBox(height: 16),
                        if (priorities.isNotEmpty) ...[
                          const WatchlistSectionTitle(
                            title: 'Priority Queue',
                            subtitle: 'Strongest candidates by priority score.',
                          ),
                          const WatchlistPriorityExplainerCard(),
                          const SizedBox(height: 12),
                          ...priorities.take(5).map((priority) {
                            final source = ref.watch(
                              watchlistItemByIdProvider(priority.id),
                            );

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: WatchlistPriorityCard(
                                model: priority,
                                onQuickBuy: source == null
                                    ? null
                                    : () => _createPurchaseFromWatchlist(source),
                                onReview: source == null
                                    ? null
                                    : () => _openDetails(source),
                              ),
                            );
                          }),
                          const SizedBox(height: 16),
                        ],
                        if (opportunities.isNotEmpty) ...[
                          const WatchlistSectionTitle(
                            title: 'Opportunities',
                            subtitle: 'Items currently under desired or max price.',
                          ),
                          ...opportunities.take(5).map(
                                (item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 10),
                                  child: WatchlistOpportunityCardV2(
                                    item: item,
                                    onQuickBuy: () =>
                                        _createPurchaseFromWatchlist(
                                      item.sourceItem,
                                    ),
                                    onOpenWatchlist: () =>
                                        _openDetails(item.sourceItem),
                                  ),
                                ),
                              ),
                          const SizedBox(height: 16),
                        ],
                        const WatchlistSectionTitle(
                          title: 'All Watchlist Items',
                        ),
                        if (items.isEmpty)
                          const Card(
                            child: Padding(
                              padding: EdgeInsets.all(16),
                              child: Text('No items match current filters.'),
                            ),
                          )
                        else
                          ...items.map((item) {
                            final priorityLabel = ref.watch(
                              watchlistPriorityLabelByIdProvider(item.id),
                            );
                            final smartRankLabel = ref.watch(
                              watchlistSmartRankLabelByIdProvider(item.id),
                            );

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: GestureDetector(
                                onLongPress: () {
                                  ref
                                      .read(
                                        watchlistSelectionControllerProvider
                                            .notifier,
                                      )
                                      .toggle(item.id);
                                },
                                child: Stack(
                                  children: [
                                    WatchlistCardV2(
                                      item: item,
                                      priorityLabel: priorityLabel,
                                      smartRankLabel: smartRankLabel,
                                      onOpenDetails: () => _openDetails(item),
                                      onCreatePurchase: () =>
                                          _createPurchaseFromWatchlist(item),
                                      onSaveReport: () =>
                                          _saveReportForItem(item),
                                    ),
                                    if (selected.contains(item.id))
                                      Positioned(
                                        top: 8,
                                        right: 8,
                                        child: Container(
                                          padding: const EdgeInsets.all(6),
                                          decoration: BoxDecoration(
                                            color: Colors.green.withValues(
                                              alpha: 0.90,
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.check,
                                            size: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            );
                          }),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}