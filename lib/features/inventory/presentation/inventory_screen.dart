import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_apply_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_counts_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_hero_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_quick_open_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_banner_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_apply_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_reserve_service.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_selection_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_selection_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_status_service.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_control_equilibrium_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_danger_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_durability_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_pressure_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filtered_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_inline_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_inline_price_suggestion_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_operational_balance_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_profit_bucket_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_readiness_pressure_compare_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reserve_toggle_service.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_execution_hint_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_lane_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_priority_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_stability_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_workload_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_risk_flag_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_status_change_service.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_visible_items_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_action_readiness_banner.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_active_filter_chips.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_center_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_filter_count_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_hero_summary_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_overview_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_severity_banner.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_severity_summary_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_bulk_quick_status_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_bulk_reserve_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_bulk_toolbar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_control_equilibrium_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_danger_summary_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_execution_confidence_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_execution_durability_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_execution_pressure_banner.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_filter_sheet.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_inline_price_suggestion_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_operational_balance_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_profit_bucket_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_readiness_pressure_compare_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_report_action_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_execution_hint_banner.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_heat_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_lane_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_priority_banner.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_stability_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_review_workload_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_search_field.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_selectable_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_sort_dropdown.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_status_filter_chips.dart';
import 'package:lego_trading_manager/features/item_details/presentation/item_details_screen.dart';
import 'package:lego_trading_manager/features/settings/application/save_action_report_flow_provider.dart';

class InventoryScreen extends ConsumerStatefulWidget {
  const InventoryScreen({super.key});

  @override
  ConsumerState<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends ConsumerState<InventoryScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(inventoryUiControllerProvider).query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _openFilters() async {
    final state = ref.read(inventoryUiControllerProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => InventoryFilterSheet(initialFilter: state.filter),
    );

    if (result != null) {
      ref.read(inventoryUiControllerProvider.notifier).setFilter(result);
    }
  }

  Future<void> _saveInventoryReport(BuildContext context, WidgetRef ref) async {
    final count = ref.read(inventoryControllerProvider).allItems.length;
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: 'Inventory Review',
          initialNote: 'Reviewed inventory list | items=$count',
        );

    if (result == null) return;

    final title = result['title'] ?? 'Inventory Review';
    final note = result['note'] ?? '';

    await ref.read(actionReportHelperProvider).save(title: title, note: note);
    await ref.read(activityLogHelperProvider).reportSaved(
          area: 'inventory',
          title: title,
        );

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Inventory report saved')),
    );
  }

  Future<void> _saveDeadStockReport(BuildContext context, WidgetRef ref) async {
    final count = ref.read(inventoryControllerProvider).allItems.length;
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: 'Inventory Aging Review',
          initialNote: 'Reviewed aging inventory | items=$count',
        );

    if (result == null) return;

    final title = result['title'] ?? 'Inventory Aging Review';
    final note = result['note'] ?? '';

    await ref.read(actionReportHelperProvider).save(title: title, note: note);
    await ref.read(activityLogHelperProvider).reportSaved(
          area: 'dead_stock',
          title: title,
        );

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Dead stock style report saved')),
    );
  }

  Future<void> _runBulkAction(
    BuildContext context,
    WidgetRef ref,
    InventoryBulkActionType action,
  ) async {
    final selected = ref.read(inventoryBulkSelectionProvider);

    await ref.read(inventoryBulkApplyProvider).run(
          selectedIds: selected,
          action: action,
        );

    ref.read(inventoryBulkSelectionProvider.notifier).clear();

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Bulk action applied: ${action.name}')),
    );
  }

  Future<void> _openItemDetails(
    BuildContext context,
    WidgetRef ref,
    ItemModel item,
  ) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => ItemDetailsScreen(item: item),
      ),
    );

    if (result == null) return;

    final deleted = result['deleted'] == true;
    final duplicated = result['duplicated'] as ItemModel?;

    if (deleted) {
      ref.read(inventoryControllerProvider.notifier).deleteItem(item.id);

      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Inventory item deleted')),
      );
      return;
    }

    if (duplicated != null) {
      ref.read(inventoryControllerProvider.notifier).addItem(duplicated);

      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Inventory item duplicated')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final ui = ref.watch(inventoryUiControllerProvider);
    final items = ref.watch(inventoryVisibleItemsProvider);
    final selected = ref.watch(inventoryBulkSelectionProvider);
    final summary = ref.watch(inventoryBulkSelectionSummaryProvider);
    final profitBuckets = ref.watch(inventoryProfitBucketProvider);
    final dangerSummary = ref.watch(inventoryDangerSummaryProvider);
    final alertSeveritySummary = ref.watch(inventoryAlertSeveritySummaryProvider);
    final alertFilter = ref.watch(inventoryAlertFilterProvider);
    final filteredAlerts = ref.watch(inventoryFilteredAlertCenterProvider);
    final alertFilterCounts = ref.watch(inventoryAlertFilterCountsProvider);
    final alertOverview = ref.watch(inventoryAlertOverviewProvider);
    final alertSeverityBanner = ref.watch(inventoryAlertSeverityBannerProvider);
    final alertHeroSummary = ref.watch(inventoryAlertHeroSummaryProvider);
    final reviewPriority = ref.watch(inventoryReviewPriorityProvider);
    final reviewWorkload = ref.watch(inventoryReviewWorkloadProvider);
    final reviewLane = ref.watch(inventoryReviewLaneProvider);
    final reviewHeat = ref.watch(inventoryReviewHeatProvider);
    final reviewExecutionHint = ref.watch(inventoryReviewExecutionHintProvider);
    final executionConfidence = ref.watch(inventoryExecutionConfidenceProvider);
    final executionPressure = ref.watch(inventoryExecutionPressureProvider);
    final reviewStability = ref.watch(inventoryReviewStabilityProvider);
    final actionReadiness = ref.watch(inventoryActionReadinessProvider);
    final readinessVsPressure = ref.watch(inventoryReadinessPressureCompareProvider);
    final controlEquilibrium = ref.watch(inventoryControlEquilibriumProvider);
    final executionDurability = ref.watch(inventoryExecutionDurabilityProvider);
    final operationalBalance = ref.watch(inventoryOperationalBalanceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory'),
        actions: [
          IconButton(
            onPressed: _openFilters,
            icon: const Icon(Icons.filter_alt_outlined),
          ),
        ],
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          InventoryReportActionBar(
            onSaveInventoryReport: () => _saveInventoryReport(context, ref),
            onSaveDeadStockReport: () => _saveDeadStockReport(context, ref),
          ),
          const SizedBox(height: 12),
          InventorySearchField(
            controller: _searchController,
            onChanged: (value) {
              ref.read(inventoryUiControllerProvider.notifier).search(value);
            },
            onClear: () {
              _searchController.clear();
              ref.read(inventoryUiControllerProvider.notifier).search('');
            },
          ),
          const SizedBox(height: 12),
          InventorySortDropdown(
            value: ui.sort,
            onChanged: (value) {
              if (value == null) return;
              ref.read(inventoryUiControllerProvider.notifier).setSort(value);
            },
          ),
          const SizedBox(height: 12),
          InventoryStatusFilterChips(
            value: ui.filter.status,
            onChanged: (status) {
              ref.read(inventoryUiControllerProvider.notifier).setFilter(
                    ui.filter.copyWith(
                      status: status,
                      clearStatus: status == null,
                    ),
                  );
            },
          ),
          const SizedBox(height: 12),
          InventoryActiveFilterChips(
            filter: ui.filter,
            sort: ui.sort,
            onClearAll: () {
              ref.read(inventoryUiControllerProvider.notifier).clearAll();
              _searchController.clear();
            },
          ),
          const SizedBox(height: 12),
          InventoryBulkToolbar(
            totalCount: items.length,
            selectedCount: summary.count,
            onSelectAll: () {
              ref.read(inventoryBulkSelectionProvider.notifier).selectAll(items.map((e) => e.id));
            },
            onClearSelection: () {
              ref.read(inventoryBulkSelectionProvider.notifier).clear();
            },
          ),
          const SizedBox(height: 12),
          InventoryBulkActionBar(
            selectedCount: selected.length,
            onAction: (action) => _runBulkAction(context, ref, action),
            onClear: () {
              ref.read(inventoryBulkSelectionProvider.notifier).clear();
            },
          ),
          const SizedBox(height: 12),
          InventoryBulkQuickStatusBar(
            selectedCount: selected.length,
            onApplyStatus: (status) async {
              final affected = await ref.read(inventoryBulkStatusProvider).apply(
                    ids: selected,
                    status: status,
                  );
              ref.read(inventoryBulkSelectionProvider.notifier).clear();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Status applied to $affected items')),
                );
              }
            },
          ),
          const SizedBox(height: 12),
          InventoryBulkReserveBar(
            selectedCount: selected.length,
            onReserve: () async {
              final affected = await ref.read(inventoryBulkReserveProvider).reserve(selected);
              ref.read(inventoryBulkSelectionProvider.notifier).clear();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Reserved $affected items')),
                );
              }
            },
            onUnreserve: () async {
              final affected = await ref.read(inventoryBulkReserveProvider).unreserve(selected);
              ref.read(inventoryBulkSelectionProvider.notifier).clear();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Unreserved $affected items')),
                );
              }
            },
          ),
          const SizedBox(height: 12),
          InventoryProfitBucketBar(model: profitBuckets),
          const SizedBox(height: 12),
          InventoryDangerSummaryCard(model: dangerSummary),
          const SizedBox(height: 12),
          InventoryReviewPriorityBanner(model: reviewPriority),
          const SizedBox(height: 12),
          InventoryReviewWorkloadCard(model: reviewWorkload),
          const SizedBox(height: 12),
          InventoryReviewLaneCard(model: reviewLane),
          const SizedBox(height: 12),
          InventoryReviewHeatCard(model: reviewHeat),
          const SizedBox(height: 12),
          InventoryReviewExecutionHintBanner(model: reviewExecutionHint),
          const SizedBox(height: 12),
          InventoryExecutionConfidenceCard(model: executionConfidence),
          const SizedBox(height: 12),
          InventoryExecutionPressureBanner(model: executionPressure),
          const SizedBox(height: 12),
          InventoryReviewStabilityCard(model: reviewStability),
          const SizedBox(height: 12),
          InventoryActionReadinessBanner(model: actionReadiness),
          const SizedBox(height: 12),
          InventoryReadinessPressureCompareCard(model: readinessVsPressure),
          const SizedBox(height: 12),
          InventoryControlEquilibriumCard(model: controlEquilibrium),
          const SizedBox(height: 12),
          InventoryExecutionDurabilityCard(model: executionDurability),
          const SizedBox(height: 12),
          InventoryOperationalBalanceCard(model: operationalBalance),
          const SizedBox(height: 12),
          InventoryAlertHeroSummaryCard(model: alertHeroSummary),
          const SizedBox(height: 12),
          InventoryAlertSeverityBanner(model: alertSeverityBanner),
          const SizedBox(height: 12),
          InventoryAlertOverviewCard(model: alertOverview),
          const SizedBox(height: 12),
          InventoryAlertFilterCountBar(
            value: alertFilter,
            counts: alertFilterCounts,
            onChanged: (value) {
              ref.read(inventoryAlertFilterProvider.notifier).set(value);
            },
          ),
          const SizedBox(height: 12),
          InventoryAlertCenterCard(
            items: filteredAlerts,
            onOpenRepricing: () {
              ref.read(inventoryAlertQuickOpenProvider).openRepricing();
            },
            onOpenOldestHeld: () {
              ref.read(inventoryAlertQuickOpenProvider).openHeldTooLong();
            },
            onOpenLowProfit: () {
              ref.read(inventoryAlertQuickOpenProvider).openLowProfit();
            },
          ),
          const SizedBox(height: 12),
          InventoryAlertSeveritySummaryCard(model: alertSeveritySummary),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text('Visible inventory items: ${items.length}'),
            ),
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No inventory items found for current filters.'),
              ),
            )
          else
            ...items.map(
              (item) {
                final riskFlag = ref.watch(inventoryRiskFlagProvider(item.id));
                final priceSuggestion = ref.watch(inventoryInlinePriceSuggestionProvider(item.id));

                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InventorySelectableCard(
                    item: item,
                    selected: selected.contains(item.id),
                    riskFlag: riskFlag,
                    onTap: () => _openItemDetails(context, ref, item),
                    onToggleSelection: () {
                      ref.read(inventoryBulkSelectionProvider.notifier).toggle(item.id);
                    },
                    extraBottom: InventoryInlinePriceSuggestionBar(
                      model: priceSuggestion,
                      onApply: priceSuggestion == null || !priceSuggestion.hasSuggestion
                          ? null
                          : () async {
                              await ref.read(analyticsRepriceApplyProvider).applySuggestedPrice(
                                    itemId: item.id,
                                    suggestedPrice: priceSuggestion.suggestedPrice,
                                    title: item.title,
                                  );
                            },
                    ),
                    onQuickStatusChanged: (status) async {
                      await ref.read(inventoryStatusChangeProvider).setStatus(
                            itemId: item.id,
                            status: status as ItemStatus,
                          );
                    },
                    onMarkListed: () async {
                      await ref.read(inventoryInlineActionProvider).markListed(item.id);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${item.title} marked listed')),
                        );
                      }
                    },
                    onMarkSold: () async {
                      await ref.read(inventoryInlineActionProvider).markSold(item.id);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${item.title} marked sold')),
                        );
                      }
                    },
                    onArchive: () async {
                      await ref.read(inventoryInlineActionProvider).archive(item.id);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${item.title} archived')),
                        );
                      }
                    },
                    onReserveToggle: () async {
                      await ref.read(inventoryReserveToggleProvider).toggle(item.id);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${item.title} reserve toggled')),
                        );
                      }
                    },
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}