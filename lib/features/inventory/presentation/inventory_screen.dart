import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';
import 'package:lego_trading_manager/features/item_details/presentation/item_details_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryScreen extends ConsumerStatefulWidget {
  const InventoryScreen({super.key});

  @override
  ConsumerState<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends ConsumerState<InventoryScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(inventoryEngineProvider.notifier).loadMore();
    }
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _FilterSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final stateAsync = ref.watch(inventoryEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('inv.title'), style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterSheet(context),
          ),
        ],
      ),
      floatingActionButton: const GlobalQuickAddFab(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          if (state.items.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.inventory_2_outlined, size: 64, color: Colors.white24),
                  const SizedBox(height: 16),
                  Text(i18n.t('inv.empty.title'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  const SizedBox(height: 8),
                  Text(i18n.t('inv.empty.sub'), style: const TextStyle(color: Colors.white38)),
                ],
              ),
            );
          }

          return ListView.builder(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: state.items.length + (state.isLoadingMore ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == state.items.length) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Center(child: CircularProgressIndicator()),
                );
              }

              final item = state.items[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(item.titleSnapshot, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${i18n.t('inv.status')}: ${item.status.name}', style: const TextStyle(color: Colors.white70)),
                  trailing: const Icon(Icons.chevron_right, color: Colors.white30),
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ItemDetailsScreen(item: item))),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _FilterSheet extends ConsumerStatefulWidget {
  const _FilterSheet();

  @override
  ConsumerState<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends ConsumerState<_FilterSheet> {
  ItemStatus? _status;
  String _sort = 'newest';

  @override
  void initState() {
    super.initState();
    final state = ref.read(inventoryEngineProvider).valueOrNull;
    if (state != null) {
      _status = state.status != null ? ItemStatus.values.firstWhere((e) => e.name == state.status) : null;
      _sort = state.sort;
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF171A21),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(i18n.t('inv.filter'), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
              const SizedBox(height: 24),
              Text(i18n.t('inv.sort'), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  ChoiceChip(label: Text(i18n.t('inv.sortNewest')), selected: _sort == 'newest', onSelected: (v) => setState(() => _sort = 'newest')),
                  ChoiceChip(label: Text(i18n.t('inv.sortCost')), selected: _sort == 'cost', onSelected: (v) => setState(() => _sort = 'cost')),
                  ChoiceChip(label: Text(i18n.t('inv.sortProfit')), selected: _sort == 'profit', onSelected: (v) => setState(() => _sort = 'profit')),
                ],
              ),
              const SizedBox(height: 24),
              Text(i18n.t('inv.status'), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.orangeAccent)),
              const SizedBox(height: 12),
              DropdownButtonFormField<ItemStatus?>(
                value: _status,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.black12,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
                items: [
                  DropdownMenuItem(value: null, child: Text(i18n.t('inv.statusAll'))),
                  ...ItemStatus.values.map((s) => DropdownMenuItem(value: s, child: Text(s.name.toUpperCase()))),
                ],
                onChanged: (val) => setState(() => _status = val),
              ),
              const SizedBox(height: 32),
              FilledButton(
                style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                onPressed: () {
                  ref.read(inventoryEngineProvider.notifier).updateFilters(_status?.name, _sort);
                  Navigator.pop(context);
                },
                child: Text(i18n.t('inv.apply'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}