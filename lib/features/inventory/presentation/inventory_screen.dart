import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_visible_items_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_active_filter_chips.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_filter_sheet.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_search_field.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_selectable_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_sort_dropdown.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_status_filter_chips.dart';
import 'package:lego_trading_manager/features/item_details/presentation/item_details_screen.dart';

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

  Future<void> _openItemDetails(BuildContext context, WidgetRef ref, ItemModel item) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => ItemDetailsScreen(item: item),
      ),
    );

    if (result == null) return;

    final deleted = result['deleted'] == true;
    final duplicated = result['duplicated'] as ItemModel?;
    final i18n = ref.read(i18nProvider.notifier);

    if (deleted) {
      ref.read(inventoryControllerProvider.notifier).deleteItem(item.id);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${i18n.t('inv.details')} ${i18n.t('common.delete')}')),
      );
      return;
    }

    if (duplicated != null) {
      ref.read(inventoryControllerProvider.notifier).addItem(duplicated);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(i18n.t('inv.itemDuplicated'))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final ui = ref.watch(inventoryUiControllerProvider);
    final items = ref.watch(inventoryVisibleItemsProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('inv.title')),
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
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(i18n.t('inv.visible', {'count': items.length.toString()})),
            ),
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(i18n.t('inv.empty')),
              ),
            )
          else
            ...items.map(
              (item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InventorySelectableCard(
                    item: item,
                    selected: false,
                    onTap: () => _openItemDetails(context, ref, item),
                    onToggleSelection: () {},
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}