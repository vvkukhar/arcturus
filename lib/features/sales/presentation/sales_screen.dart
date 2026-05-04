import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_duplicate_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_metrics_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sales_selection_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';
import 'package:lego_trading_manager/features/sales/application/sales_ui_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_visible_provider.dart';
import 'package:lego_trading_manager/features/sales/presentation/add_sale_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sale_details_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_active_filter_chips.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_empty_state_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_filter_sheet.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_metrics_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_search_field.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_selection_toolbar.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_sort_dropdown.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sales_summary_bar.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_selectable_card.dart';
import 'package:lego_trading_manager/features/sales/application/sale_status_label_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_link_status_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_stock_flow_status_provider.dart';

class SalesScreen extends ConsumerStatefulWidget {
  const SalesScreen({super.key});

  @override
  ConsumerState<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends ConsumerState<SalesScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(salesUiControllerProvider).query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _sortLabel(SalesSortOption option) {
    switch (option) {
      case SalesSortOption.newest: return 'Newest';
      case SalesSortOption.oldest: return 'Oldest';
      case SalesSortOption.finalNetHighToLow: return 'Net High-Low';
      case SalesSortOption.finalNetLowToHigh: return 'Net Low-High';
      case SalesSortOption.platformAsc: return 'Platform A-Z';
    }
  }

  Future<void> _deleteSaleFully(String id) async {
    await ref.read(inventorySaleAllocationControllerProvider.notifier).clearPurchase(id);
    await ref.read(salePurchaseLinkControllerProvider.notifier).unlinkPurchase(id);
    await ref.read(salesControllerProvider.notifier).deleteSale(id);
  }

  Future<void> _openAdd() async {
    final result = await Navigator.of(context).push<SaleModel>(
      MaterialPageRoute(builder: (_) => const AddSaleScreen()),
    );
    if (result == null) return;
    await ref.read(salesControllerProvider.notifier).addSale(result);
  }

  Future<void> _openDetails(SaleModel sale) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(builder: (_) => SaleDetailsScreen(sale: sale)),
    );
    if (result == null) return;
    if (result['updated'] != null) {
      await ref.read(salesControllerProvider.notifier).updateSale(result['updated'] as SaleModel);
    } else if (result['duplicated'] != null) {
      await ref.read(salesControllerProvider.notifier).addSale(result['duplicated'] as SaleModel);
    } else if (result['deleted'] == true) {
      final id = result['id'] as String?;
      if (id != null) await _deleteSaleFully(id);
    }
  }

  Future<void> _duplicate(SaleModel sale) async {
    final duplicated = ref.read(saleDuplicateProvider).duplicate(sale);
    await ref.read(salesControllerProvider.notifier).addSale(duplicated);
  }

  Future<void> _openFilters() async {
    final ui = ref.read(salesUiControllerProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => SalesFilterSheet(initialFilter: ui.filter),
    );
    if (result != null) ref.read(salesUiControllerProvider.notifier).setFilter(result);
  }

  Future<void> _deleteSelected(Set<String> selectedIds) async {
    if (selectedIds.isEmpty) return;
    for (final id in selectedIds) {
      await _deleteSaleFully(id);
    }
    ref.read(salesSelectionControllerProvider.notifier).clear();
  }

  @override
  Widget build(BuildContext context) {
    final ui = ref.watch(salesUiControllerProvider);
    final visible = ref.watch(salesVisibleProvider);
    final metrics = ref.watch(salesMetricsProvider);
    final selectedIds = ref.watch(salesSelectionControllerProvider);
    final selection = ref.read(salesSelectionControllerProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sales'),
        actions: [
          IconButton(onPressed: _openFilters, icon: const Icon(Icons.filter_alt_outlined)),
          IconButton(onPressed: _openAdd, icon: const Icon(Icons.add)),
        ],
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            SalesSearchField(
              controller: _searchController,
              onChanged: (value) => ref.read(salesUiControllerProvider.notifier).search(value),
              onClear: () {
                _searchController.clear();
                ref.read(salesUiControllerProvider.notifier).search('');
              },
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: SalesSortDropdown(
                    value: ui.sort,
                    onChanged: (value) {
                      if (value != null) ref.read(salesUiControllerProvider.notifier).setSort(value);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                FilledButton.tonalIcon(
                  onPressed: _openFilters,
                  icon: const Icon(Icons.tune),
                  label: const Text('Filters'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SalesSummaryBar(
              visibleCount: metrics.visibleCount,
              totalCount: metrics.totalCount,
              sortLabel: _sortLabel(ui.sort),
            ),
            const SizedBox(height: 12),
            SalesActiveFilterChips(filter: ui.filter),
            const SizedBox(height: 12),
            Expanded(
              child: visible.isEmpty
                  ? SalesEmptyStateCard(onAddSale: _openAdd)
                  : ListView(
                      children: [
                        SalesMetricsCard(model: metrics),
                        const SizedBox(height: 12),
                        SalesSelectionToolbar(
                          visibleCount: visible.length,
                          selectedCount: selectedIds.length,
                          onSelectAll: () => selection.selectAll(visible.map((item) => item.id)),
                          onClear: selection.clear,
                        ),
                        const SizedBox(height: 8),
                        SalesBulkActionBar(
                          selectedCount: selectedIds.length,
                          onDeleteSelected: () => _deleteSelected(selectedIds),
                          onClear: selection.clear,
                        ),
                        const SizedBox(height: 12),
                        ...visible.map((sale) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: SaleSelectableCard(
                              sale: sale,
                              statusLabel: ref.watch(saleStatusLabelProvider(sale)),
                              linkStatus: ref.watch(saleLinkStatusProvider(sale)),
                              stockStatus: ref.watch(saleStockFlowStatusProvider(sale)),
                              selected: selectedIds.contains(sale.id),
                              onSelected: (_) => selection.toggle(sale.id),
                              onOpenDetails: () => _openDetails(sale),
                              onDuplicate: () => _duplicate(sale),
                              onSaveReport: () {}, // Removed unnecessary dependencies for clarity
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