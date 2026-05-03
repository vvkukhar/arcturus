import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_type_filter_provider.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_result_card.dart';

class GlobalSearchScreen extends ConsumerStatefulWidget {
  const GlobalSearchScreen({super.key});

  @override
  ConsumerState<GlobalSearchScreen> createState() => _GlobalSearchScreenState();
}

class _GlobalSearchScreenState extends ConsumerState<GlobalSearchScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.text = ref.read(globalSearchQueryProvider);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = ref.watch(globalSearchQueryProvider);
    final typeFilter = ref.watch(globalSearchTypeFilterProvider);
    final searchResults = ref.watch(globalSearchProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Global Search'),
      ),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search inventory, purchases, sales...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: query.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(globalSearchQueryProvider.notifier).clear();
                        },
                      )
                    : null,
              ),
              onChanged: (val) {
                ref.read(globalSearchQueryProvider.notifier).set(val);
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String?>(
              value: typeFilter,
              decoration: const InputDecoration(labelText: 'Type Filter'),
              items: const [
                DropdownMenuItem(value: null, child: Text('All')),
                DropdownMenuItem(value: 'inventory', child: Text('Inventory')),
                DropdownMenuItem(value: 'purchase', child: Text('Purchases')),
                DropdownMenuItem(value: 'sale', child: Text('Sales')),
                DropdownMenuItem(value: 'watchlist', child: Text('Watchlist')),
                DropdownMenuItem(value: 'market', child: Text('Market')),
              ],
              onChanged: (val) {
                ref.read(globalSearchTypeFilterProvider.notifier).set(val);
              },
            ),
            const SizedBox(height: 16),
            Expanded(
              child: query.trim().isEmpty
                  ? const Center(
                      child: Text(
                        'Start typing to search across the system...',
                        style: TextStyle(color: Colors.white70),
                      ),
                    )
                  : searchResults.isEmpty
                      ? const Center(
                          child: Text(
                            'No results found.',
                            style: TextStyle(color: Colors.white70),
                          ),
                        )
                      : ListView.builder(
                          itemCount: searchResults.length,
                          itemBuilder: (context, index) {
                            final result = searchResults[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: GlobalSearchResultCard(
                                result: result,
                                onTap: () => Navigator.of(context).pushNamed(result.route),
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