import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/item_details/presentation/item_details_screen.dart';
import 'package:lego_trading_manager/features/market/application/market_controller.dart';
import 'package:lego_trading_manager/features/market/presentation/market_snapshot_details_screen.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchase_details_screen.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/presentation/sale_details_screen.dart';
import 'package:lego_trading_manager/features/search/application/global_search_grouped_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_recent_queries_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_scope_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_only_provider.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_empty_state_card.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_field.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_recent_queries.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_result_card.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_result_compact_tile.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_scope_bar.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_item_details_screen.dart';

enum GlobalSearchDensityMode { comfortable, compact }

class GlobalSearchScreen extends ConsumerStatefulWidget {
  const GlobalSearchScreen({super.key});

  @override
  ConsumerState<GlobalSearchScreen> createState() => _GlobalSearchScreenState();
}

class _GlobalSearchScreenState extends ConsumerState<GlobalSearchScreen> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  bool _compact = false;

  @override
  void initState() {
    super.initState();
    _controller.text = ref.read(globalSearchQueryProvider);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  Future<void> _openResult(GlobalSearchResultModel result) async {
    final query = ref.read(globalSearchQueryProvider).trim();
    if (query.isNotEmpty) {
      ref.read(globalSearchRecentQueriesProvider.notifier).add(query);
    }

    final payload = result.payload;

    if (payload is ItemModel) {
      final response = await Navigator.of(context).push<Map<String, dynamic>>(
        MaterialPageRoute(builder: (_) => ItemDetailsScreen(item: payload)),
      );
      if (response != null && response['duplicated'] is ItemModel) {
        ref.read(inventoryControllerProvider.notifier).addItem(
              response['duplicated'] as ItemModel,
            );
      }
      if (response != null && response['deleted'] == true) {
        ref.read(inventoryControllerProvider.notifier).deleteItem(payload.id);
      }
      return;
    }

    if (payload is WatchlistItemModel) {
      final response = await Navigator.of(context).push<Map<String, dynamic>>(
        MaterialPageRoute(
          builder: (_) => WatchlistItemDetailsScreen(item: payload),
        ),
      );
      if (response != null && response['updated'] is WatchlistItemModel) {
        ref.read(watchlistControllerProvider.notifier).updateItem(
              response['updated'] as WatchlistItemModel,
            );
      }
      if (response != null && response['deleted'] == true) {
        ref.read(watchlistControllerProvider.notifier).deleteItem(payload.id);
      }
      return;
    }

    if (payload is PurchaseModel) {
      final response = await Navigator.of(context).push<Map<String, dynamic>>(
        MaterialPageRoute(
          builder: (_) => PurchaseDetailsScreen(purchase: payload),
        ),
      );
      if (response != null && response['updated'] is PurchaseModel) {
        ref.read(purchasesControllerProvider.notifier).updatePurchase(
              response['updated'] as PurchaseModel,
            );
      }
      if (response != null && response['duplicated'] is PurchaseModel) {
        ref.read(purchasesControllerProvider.notifier).addPurchase(
              response['duplicated'] as PurchaseModel,
            );
      }
      if (response != null && response['deleted'] == true) {
        ref
            .read(purchasesControllerProvider.notifier)
            .deletePurchase(payload.id);
      }
      return;
    }

    if (payload is SaleModel) {
      final response = await Navigator.of(context).push<Map<String, dynamic>>(
        MaterialPageRoute(builder: (_) => SaleDetailsScreen(sale: payload)),
      );
      if (response != null && response['updated'] is SaleModel) {
        ref.read(salesControllerProvider.notifier).updateSale(
              response['updated'] as SaleModel,
            );
      }
      if (response != null && response['deleted'] == true) {
        ref.read(salesControllerProvider.notifier).deleteSale(payload.id);
      }
      return;
    }

    if (payload is MarketSnapshotModel) {
      final response = await Navigator.of(context).push<Map<String, dynamic>>(
        MaterialPageRoute(
          builder: (_) => MarketSnapshotDetailsScreen(snapshot: payload),
        ),
      );
      if (response != null && response['updated'] is MarketSnapshotModel) {
        ref.read(marketControllerProvider.notifier).updateSnapshot(
              response['updated'] as MarketSnapshotModel,
            );
      }
      if (response != null && response['duplicated'] is MarketSnapshotModel) {
        ref.read(marketControllerProvider.notifier).addSnapshot(
              response['duplicated'] as MarketSnapshotModel,
            );
      }
      if (response != null && response['deleted'] == true) {
        ref.read(marketControllerProvider.notifier).deleteSnapshot(payload.id);
      }
      return;
    }

    if (!mounted) {
      return;
    }
    Navigator.of(context).pushNamed(result.route);
  }

  @override
  Widget build(BuildContext context) {
    final query = ref.watch(globalSearchQueryProvider);
    final results = ref.watch(globalSearchProvider);
    final sections = ref.watch(globalSearchGroupedProvider);
    final recentQueries = ref.watch(globalSearchRecentQueriesProvider);
    final topOnly = ref.watch(globalSearchTopOnlyProvider);
    final scope = ref.watch(globalSearchScopeProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Global Search')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Shortcuts(
              shortcuts: <ShortcutActivator, Intent>{
                const SingleActivator(LogicalKeyboardKey.escape):
                    const ActivateIntent(),
              },
              child: Actions(
                actions: <Type, Action<Intent>>{
                  ActivateIntent: CallbackAction<Intent>(
                    onInvoke: (_) {
                      _controller.clear();
                      ref.read(globalSearchQueryProvider.notifier).state = '';
                      return null;
                    },
                  ),
                },
                child: GlobalSearchField(
                  controller: _controller,
                  onChanged: (value) {
                    ref.read(globalSearchQueryProvider.notifier).state = value;
                  },
                  onClear: () {
                    _controller.clear();
                    ref.read(globalSearchQueryProvider.notifier).state = '';
                  },
                ),
              ),
            ),
            const SizedBox(height: 12),
            GlobalSearchScopeBar(
              selected: scope,
              onSelected: (value) {
                ref.read(globalSearchScopeProvider.notifier).state = value;
              },
              onSaveAsDefault: () {},
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Top only'),
              value: topOnly,
              onChanged: (value) {
                ref.read(globalSearchTopOnlyProvider.notifier).state = value;
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Compact results'),
              value: _compact,
              onChanged: (value) {
                setState(() {
                  _compact = value;
                });
              },
            ),
            const SizedBox(height: 12),
            Expanded(
              child: query.trim().isEmpty
                  ? GlobalSearchRecentQueries(
                      queries: recentQueries,
                      onTapQuery: (value) {
                        _controller.text = value;
                        ref.read(globalSearchQueryProvider.notifier).state =
                            value;
                      },
                      onRemoveQuery: (value) {
                        ref
                            .read(globalSearchRecentQueriesProvider.notifier)
                            .remove(value);
                      },
                      onClearAll: () {
                        ref
                            .read(globalSearchRecentQueriesProvider.notifier)
                            .clear();
                      },
                    )
                  : sections.isEmpty
                      ? GlobalSearchEmptyStateCard(
                          suggestions: const [],
                          onTry: (value) {
                            _controller.text = value;
                            ref.read(globalSearchQueryProvider.notifier).state =
                                value;
                          },
                        )
                      : ListView(
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Align(
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  'Results: ${results.length}',
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ),
                            ...sections.map(
                              (section) => Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${section.title} (${section.items.length})',
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    ...section.items.map(
                                      (item) => Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 10),
                                        child: _compact
                                            ? GlobalSearchResultCompactTile(
                                                result: item,
                                                onTap: () => _openResult(item),
                                              )
                                            : GlobalSearchResultCard(
                                                result: item,
                                                onTap: () => _openResult(item),
                                              ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }
}