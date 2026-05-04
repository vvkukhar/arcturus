import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_duplicate_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_status_label_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_metrics_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_selection_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_ui_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_visible_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/presentation/add_purchase_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchase_details_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_selectable_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_active_filter_chips.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_empty_state_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_filter_sheet.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_metrics_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_search_field.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_selection_toolbar.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_sort_dropdown.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchases_summary_bar.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';

class PurchasesScreen extends ConsumerStatefulWidget {
  const PurchasesScreen({super.key});

  @override
  ConsumerState<PurchasesScreen> createState() => _PurchasesScreenState();
}

class _PurchasesScreenState extends ConsumerState<PurchasesScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(purchasesUiControllerProvider).query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _sortLabel(PurchasesSortOption option) {
    switch (option) {
      case PurchasesSortOption.newest: return 'Newest';
      case PurchasesSortOption.oldest: return 'Oldest';
      case PurchasesSortOption.totalHighToLow: return 'Total High-Low';
      case PurchasesSortOption.totalLowToHigh: return 'Total Low-High';
      case PurchasesSortOption.sourceAsc: return 'Source A-Z';
    }
  }

  Future<void> _deletePurchaseFully(String id) async {
    await ref.read(inventorySaleAllocationControllerProvider.notifier).clearPurchase(id);
    await ref.read(salePurchaseLinkControllerProvider.notifier).unlinkPurchase(id);
    await ref.read(purchasesControllerProvider.notifier).deletePurchase(id);
  }

  Future<void> _openAdd() async {
    final result = await Navigator.of(context).push<PurchaseModel>(
      MaterialPageRoute(builder: (_) => const AddPurchaseScreen()),
    );
    if (result == null) return;
    await ref.read(purchasesControllerProvider.notifier).addPurchase(result);
  }

  Future<void> _openDetails(PurchaseModel purchase) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(builder: (_) => PurchaseDetailsScreen(purchase: purchase)),
    );
    if (result == null) return;
    if (result['updated'] != null) {
      await ref.read(purchasesControllerProvider.notifier).updatePurchase(result['updated'] as PurchaseModel);
    } else if (result['duplicated'] != null) {
      await ref.read(purchasesControllerProvider.notifier).addPurchase(result['duplicated'] as PurchaseModel);
    } else if (result['deleted'] == true) {
      final id = result['id'] as String?;
      if (id != null) await _deletePurchaseFully(id);
    }
  }

  Future<void> _duplicate(PurchaseModel purchase) async {
    final duplicated = ref.read(purchaseDuplicateProvider).duplicate(purchase);
    await ref.read(purchasesControllerProvider.notifier).addPurchase(duplicated);
  }

  Future<void> _openFilters() async {
    final ui = ref.read(purchasesUiControllerProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => PurchasesFilterSheet(initialFilter: ui.filter),
    );
    if (result != null) ref.read(purchasesUiControllerProvider.notifier).setFilter(result);
  }

  Future<void> _deleteSelected(Set<String> selectedIds) async {
    if (selectedIds.isEmpty) return;
    for (final id in selectedIds) {
      await _deletePurchaseFully(id);
    }
    ref.read(purchasesSelectionControllerProvider.notifier).clear();
  }

  @override
  Widget build(BuildContext context) {
    final ui = ref.watch(purchasesUiControllerProvider);
    final visible = ref.watch(purchasesVisibleWithStockProvider);
    final metrics = ref.watch(purchasesMetricsWithStockProvider);
    final selectedIds = ref.watch(purchasesSelectionControllerProvider);
    final selection = ref.read(purchasesSelectionControllerProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchases'),
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
            PurchasesSearchField(
              controller: _searchController,
              onChanged: (value) => ref.read(purchasesUiControllerProvider.notifier).search(value),
              onClear: () {
                _searchController.clear();
                ref.read(purchasesUiControllerProvider.notifier).search('');
              },
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: PurchasesSortDropdown(
                    value: ui.sort,
                    onChanged: (value) {
                      if (value != null) ref.read(purchasesUiControllerProvider.notifier).setSort(value);
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
            PurchasesSummaryBar(
              visibleCount: metrics.visibleCount,
              totalCount: metrics.totalCount,
              sortLabel: _sortLabel(ui.sort),
            ),
            const SizedBox(height: 12),
            PurchasesActiveFilterChips(filter: ui.filter),
            const SizedBox(height: 12),
            PurchasesMetricsCard(model: metrics),
            const SizedBox(height: 12),
            PurchasesSelectionToolbar(
              visibleCount: visible.length,
              selectedCount: selectedIds.length,
              onSelectAll: () => selection.selectAll(visible.map((item) => item.id)),
              onClear: selection.clear,
            ),
            const SizedBox(height: 8),
            PurchasesBulkActionBar(
              selectedCount: selectedIds.length,
              onDeleteSelected: () => _deleteSelected(selectedIds),
              onClear: selection.clear,
            ),
            const SizedBox(height: 12),
            Expanded(
              child: visible.isEmpty
                  ? PurchasesEmptyStateCard(onAddPurchase: _openAdd)
                  : ListView.builder(
                      itemCount: visible.length,
                      itemBuilder: (context, index) {
                        final purchase = visible[index];
                        final statusLabel = ref.watch(purchaseStatusLabelProvider(purchase));
                        final selected = selectedIds.contains(purchase.id);

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: PurchaseSelectableCard(
                            purchase: purchase,
                            statusLabel: statusLabel,
                            selected: selected,
                            onSelected: (_) => selection.toggle(purchase.id),
                            onOpenDetails: () => _openDetails(purchase),
                            onDuplicate: () => _duplicate(purchase),
                            onSaveReport: () {}, // Removed unnecessary dependencies for clarity
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}