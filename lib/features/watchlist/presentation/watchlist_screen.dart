import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
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
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_visible_items_provider.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/add_watchlist_item_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_item_details_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_card_v2.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_empty_state.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_filter_sheet.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_header_actions_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_card_v2.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_explainer_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_dashboard_section.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_select_all_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_batch_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_search_field.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_section_title.dart';
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

  Future<void> _openDetails(WatchlistItemModel item, I18nNotifier i18n) async {
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
        SnackBar(content: Text(i18n.t('Watchlist item deleted'))),
      );
      return;
    }

    final updated = result['updated'] as WatchlistItemModel?;
    if (updated != null) {
      ref.read(watchlistControllerProvider.notifier).updateItem(updated);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(i18n.t('Watchlist item updated'))),
      );
    }
  }

  Future<void> _createPurchaseFromWatchlist(WatchlistItemModel item, I18nNotifier i18n) async {
    final result = ref.read(watchlistPurchaseCreateProvider).build(item);

    ref.read(inventoryControllerProvider.notifier).addItem(result.item);
    ref.read(purchasesControllerProvider.notifier).addPurchase(result.purchase);
    ref.read(watchlistControllerProvider.notifier).updateItem(
          item.copyWith(isActive: false),
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${i18n.t('Purchase created:')} ${item.title}')),
    );
  }

  Future<void> _saveReportForItem(WatchlistItemModel item, I18nNotifier i18n) async {
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: i18n.t('Watchlist Item Review'),
          initialNote:
              '${i18n.t('Reviewed')} ${item.title} | desired=${item.desiredBuyPrice.toStringAsFixed(2)} | max=${item.maxBuyPrice.toStringAsFixed(2)}',
        );

    if (result == null) return;

    await ref.read(actionReportHelperProvider).save(
          title: result['title'] ?? i18n.t('Watchlist Item Review'),
          note: result['note'] ?? '',
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(i18n.t('Watchlist report saved'))),
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

  Future<void> _buySelectedReviewQueue(I18nNotifier i18n) async {
    final reviewQueue = ref.read(watchlistReviewQueueProvider);
    final selected = ref.read(watchlistReviewQueueSelectionProvider);

    for (final item in reviewQueue) {
      if (!selected.contains(item.id)) continue;
      await _createPurchaseFromWatchlist(item, i18n);
    }

    ref.read(watchlistReviewQueueSelectionProvider.notifier).clear();
  }

  void _activateSelected() {
    final selected = ref.read(watchlistSelectionControllerProvider).selectedIds;
    ref.read(watchlistControllerProvider.notifier).activateMany(selected);
    ref.read(watchlistSelectionControllerProvider.notifier).clear();
  }

  void _deactivateSelected() {
    final selected = ref.read(watchlistSelectionControllerProvider).selectedIds;
    ref.read(watchlistControllerProvider.notifier).deactivateMany(selected);
    ref.read(watchlistSelectionControllerProvider.notifier).clear();
  }

  Future<void> _deleteSelected(I18nNotifier i18n) async {
    final selected = ref.read(watchlistSelectionControllerProvider).selectedIds;
    if (selected.isEmpty) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(i18n.t('Delete selected items')),
        content: Text(i18n.t('common.deleteConfirmText', {'title': '${selected.length} ${i18n.t('selected watchlist items')}'})),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(i18n.t('common.cancel')),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(i18n.t('common.delete')),
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
    final selected = ref.watch(watchlistSelectionControllerProvider).selectedIds;

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

    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('cc.watch')),
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
              sortLabel: i18n.t(ui.sort.label),
            ),
            const SizedBox(height: 12),
            WatchlistBulkActionBar(
              selectedCount: selected.length,
              onActivate: _activateSelected,
              onDeactivate: _deactivateSelected,
              onDelete: () => _deleteSelected(i18n),
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
                          onOpenFilters: _openFilters,
                          onOpenOpportunityCenter: () {
                            Navigator.of(context).pushNamed(
                              AppRouter.opportunityCenter,
                            );
                          },
                          onAddItem: _openAdd,
                        ),
                        const SizedBox(height: 14),
                        WatchlistSectionTitle(
                          title: i18n.t('Queue Control'),
                          subtitle: i18n.t('Cash pressure, readiness and execution state.'),
                        ),
                        WatchlistQueueDashboardSection(
                          availableCash: availableCash,
                          onAvailableCashChanged: (value) {
                            ref
                                .read(watchlistAvailableCashProvider.notifier)
                                .set(value);
                          },
                          autoBuySimulation: autoBuySimulation,
                          autoBuyCashCompare: autoBuyCashCompare,
                          queueCashWarning: queueCashWarning,
                          queueSummary: queueSummary,
                          queueProfitability: queueProfitability,
                          affordabilityBadge: affordabilityBadge,
                          affordabilitySummary: affordabilitySummary,
                          queueBuyPowerRatio: queueBuyPowerRatio,
                          queuePressure: queuePressure,
                          smartRank: smartRank,
                          queueBatchSummary: queueBatchSummary,
                          actionableQueueSummary: actionableQueueSummary,
                          queueExecutionHint: queueExecutionHint,
                          queueExecutionPressureSummary: queueExecutionPressureSummary,
                          nextBestAction: nextBestAction,
                          queueReadiness: queueReadiness,
                          queueActionConfidence: queueActionConfidence,
                          queueCommitHint: queueCommitHint,
                          commitStability: commitStability,
                          executionMaturity: executionMaturity,
                          queueRiskReward: queueRiskReward,
                          capitalDiscipline: capitalDiscipline,
                          executionDiscipline: executionDiscipline,
                          executionBalance: executionBalance,
                          commitDurability: commitDurability,
                          allocationStability: allocationStability,
                        ),
                        const SizedBox(height: 16),
                        WatchlistSectionTitle(
                          title: i18n.t('Review Queue'),
                          subtitle: i18n.t('Actionable items under max buy price.'),
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
                        WatchlistReviewQueueBatchBar(
                          selectedCount: reviewQueueSelected.length,
                          onBuySelected: () => _buySelectedReviewQueue(i18n),
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
                          onOpen: (item) => _openDetails(item, i18n),
                          onQuickBuy: (item) => _createPurchaseFromWatchlist(item, i18n),
                        ),
                        const SizedBox(height: 16),
                        if (priorities.isNotEmpty) ...[
                          WatchlistSectionTitle(
                            title: i18n.t('Priority Queue'),
                            subtitle: i18n.t('Strongest candidates by priority score.'),
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
                                    : () => _createPurchaseFromWatchlist(source, i18n),
                                onReview: source == null
                                    ? null
                                    : () => _openDetails(source, i18n),
                              ),
                            );
                          }),
                          const SizedBox(height: 16),
                        ],
                        if (opportunities.isNotEmpty) ...[
                          WatchlistSectionTitle(
                            title: i18n.t('Opportunities'),
                            subtitle: i18n.t('Items currently under desired or max price.'),
                          ),
                          ...opportunities.take(5).map(
                                (item) => Padding(
                                  padding: const EdgeInsets.only(bottom: 10),
                                  child: WatchlistOpportunityCardV2(
                                    item: item,
                                    onQuickBuy: () =>
                                        _createPurchaseFromWatchlist(
                                      item.sourceItem, i18n
                                    ),
                                    onOpenWatchlist: () =>
                                        _openDetails(item.sourceItem, i18n),
                                  ),
                                ),
                              ),
                          const SizedBox(height: 16),
                        ],
                        WatchlistSectionTitle(
                          title: i18n.t('All Watchlist Items'),
                        ),
                        if (items.isEmpty)
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Text(i18n.t('No items match current filters.')),
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
                                      onOpenDetails: () => _openDetails(item, i18n),
                                      onCreatePurchase: () =>
                                          _createPurchaseFromWatchlist(item, i18n),
                                      onSaveReport: () =>
                                          _saveReportForItem(item, i18n),
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