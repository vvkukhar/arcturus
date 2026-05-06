import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/empty_state_view.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_type.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_apply_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_selection_controller.dart';
import 'package:lego_trading_manager/features/market/application/market_controller.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';
import 'package:lego_trading_manager/features/market/application/market_ui_controller.dart';
import 'package:lego_trading_manager/features/market/application/market_visible_snapshots_provider.dart';
import 'package:lego_trading_manager/features/market/presentation/add_market_snapshot_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_snapshot_details_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_active_filter_chips.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_bulk_action_bar.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_filter_sheet.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_search_field.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_selectable_snapshot_card.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_sort_dropdown.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_summary_bar.dart';
import 'package:lego_trading_manager/features/market/presentation/widgets/market_toolbar.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

class MarketScreen extends ConsumerStatefulWidget {
  const MarketScreen({super.key});

  @override
  ConsumerState<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends ConsumerState<MarketScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _itemTitle(String itemRef) {
    return ref.read(inventoryRepositoryProvider).getById(itemRef)?.title ?? itemRef;
  }

  String _sortLabel(MarketSortOption option, I18nNotifier i18n) {
    switch (option) {
      case MarketSortOption.newest: return i18n.t('Newest');
      case MarketSortOption.oldest: return i18n.t('Oldest');
      case MarketSortOption.averageHighToLow: return i18n.t('Average High-Low');
      case MarketSortOption.lowHighToLow: return i18n.t('Low High-Low');
      case MarketSortOption.highHighToLow: return i18n.t('High High-Low');
      case MarketSortOption.sourceAsc: return i18n.t('Source A-Z');
    }
  }

  Future<void> _openAdd(BuildContext context) async {
    final result = await Navigator.of(context).push<MarketSnapshotModel>(
      MaterialPageRoute(builder: (_) => const AddMarketSnapshotScreen()),
    );
    if (result == null) return;
    ref.read(marketControllerProvider.notifier).addSnapshot(result);
  }

  Future<void> _openDetails(BuildContext context, MarketSnapshotModel snapshot) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(builder: (_) => MarketSnapshotDetailsScreen(snapshot: snapshot)),
    );
    if (result == null) return;
    if (result['deleted'] == true) {
      final id = result['id'] as String?;
      if (id != null) ref.read(marketControllerProvider.notifier).deleteSnapshot(id);
    } else if (result['updated'] != null) {
      ref.read(marketControllerProvider.notifier).updateSnapshot(result['updated'] as MarketSnapshotModel);
    } else if (result['duplicated'] != null) {
      ref.read(marketControllerProvider.notifier).addSnapshot(result['duplicated'] as MarketSnapshotModel);
    }
  }

  Future<void> _openFilters() async {
    final state = ref.read(marketUiControllerProvider);
    final result = await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => MarketFilterSheet(initialFilter: state.filter),
    );
    if (result != null) ref.read(marketUiControllerProvider.notifier).setFilter(result);
  }

  void _runBulkAction(MarketBulkActionType action) {
    final selected = ref.read(marketBulkSelectionProvider);
    ref.read(marketBulkApplyProvider).deleteSelected(selected);
    ref.read(marketBulkSelectionProvider.notifier).clear();
    ref.read(marketControllerProvider.notifier).load();
  }

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(marketUiControllerProvider).query;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final snapshots = ref.watch(marketControllerProvider);
    final visibleSnapshots = ref.watch(marketVisibleSnapshotsProvider);
    final ui = ref.watch(marketUiControllerProvider);
    final selected = ref.watch(marketBulkSelectionProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('market.title')),
        actions: [
          IconButton(onPressed: () => _openAdd(context), icon: const Icon(Icons.add)),
        ],
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: snapshots.isEmpty
            ? EmptyStateView(
                title: 'market.empty',
                subtitle: 'Capture low / avg / high references over time.',
              )
            : Column(
                children: [
                  MarketSearchField(
                    controller: _searchController,
                    onChanged: (value) => ref.read(marketUiControllerProvider.notifier).search(value),
                    onClear: () {
                      _searchController.clear();
                      ref.read(marketUiControllerProvider.notifier).search('');
                    },
                  ),
                  const SizedBox(height: 12),
                  MarketToolbar(
                    onOpenFilters: _openFilters,
                    sortDropdown: MarketSortDropdown(
                      value: ui.sortOption,
                      onChanged: (value) {
                        if (value != null) ref.read(marketUiControllerProvider.notifier).setSort(value);
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  MarketSummaryBar(
                    visibleCount: visibleSnapshots.length,
                    totalCount: snapshots.length,
                    sortLabel: _sortLabel(ui.sortOption, i18n),
                  ),
                  const SizedBox(height: 12),
                  MarketBulkActionBar(
                    selectedCount: selected.length,
                    onAction: _runBulkAction,
                    onClear: () => ref.read(marketBulkSelectionProvider.notifier).clear(),
                  ),
                  const SizedBox(height: 12),
                  MarketActiveFilterChips(
                    query: ui.query,
                    filter: ui.filter,
                    onClearAll: () {
                      _searchController.clear();
                      ref.read(marketUiControllerProvider.notifier).clearAll();
                    },
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: visibleSnapshots.isEmpty
                        ? Center(child: Text(i18n.t('Nothing found for current market filters.')))
                        : ListView.builder(
                            itemCount: visibleSnapshots.length,
                            itemBuilder: (context, index) {
                              final snapshot = visibleSnapshots[index];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 10),
                                child: MarketSelectableSnapshotCard(
                                  snapshot: snapshot,
                                  itemTitle: _itemTitle(snapshot.itemRef),
                                  selected: selected.contains(snapshot.id),
                                  onTap: () => _openDetails(context, snapshot),
                                  onToggleSelection: () => ref.read(marketBulkSelectionProvider.notifier).toggle(snapshot.id),
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