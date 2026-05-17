import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/search_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class GlobalSearchScreen extends ConsumerWidget {
  const GlobalSearchScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(searchEngineProvider);
    final engine = ref.read(searchEngineProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('cc.searchGlob'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextField(
                      onChanged: (val) => engine.search(val, typeFilter: state.typeFilter),
                      onSubmitted: (val) => engine.saveRecentQuery(val),
                      decoration: InputDecoration(
                        hintText: i18n.t('search.hint'),
                        prefixIcon: const Icon(Icons.search),
                        filled: true,
                        fillColor: const Color(0xFF171A21),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String?>(
                      value: state.typeFilter,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF171A21),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                      ),
                      items: [
                        DropdownMenuItem(value: null, child: Text(i18n.t('search.all'))),
                        DropdownMenuItem(value: 'inventory', child: Text(i18n.t('inv.title'))),
                        DropdownMenuItem(value: 'purchase', child: Text(i18n.t('pur.title'))),
                        DropdownMenuItem(value: 'sale', child: Text(i18n.t('sale.title'))),
                        DropdownMenuItem(value: 'watchlist', child: Text(i18n.t('drawer.watchlist'))),
                        DropdownMenuItem(value: 'market', child: Text(i18n.t('market.title'))),
                      ],
                      onChanged: (val) => engine.search(state.query, typeFilter: val),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: state.query.isEmpty
                    ? ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        children: [
                          if (state.recentQueries.isNotEmpty) ...[
                            Text(i18n.t('search.recent'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              children: state.recentQueries.map((q) => ActionChip(label: Text(q), onPressed: () => engine.search(q))).toList(),
                            ),
                            const SizedBox(height: 24),
                          ],
                          if (state.pinnedResults.isNotEmpty) ...[
                            Text(i18n.t('search.pinned'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            const SizedBox(height: 8),
                            ...state.pinnedResults.map((p) => _ResultTile(result: p, engine: engine)),
                          ]
                        ],
                      )
                    : state.searchResults.isEmpty
                        ? Center(child: Text(i18n.t('common.none'), style: const TextStyle(color: Colors.white54)))
                        : ListView.builder(
                            physics: const BouncingScrollPhysics(),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: state.searchResults.length,
                            itemBuilder: (context, index) => _ResultTile(result: state.searchResults[index], engine: engine),
                          ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _ResultTile extends ConsumerWidget {
  final SearchResult result;
  final SearchEngine engine;
  const _ResultTile({required this.result, required this.engine});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      color: const Color(0xFF171A21),
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(result.title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(i18n.t(result.subKey, result.subArgs), style: const TextStyle(color: Colors.white70)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (result.score > 0) Text(result.score.toString(), style: const TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold, fontSize: 12)),
            IconButton(
              icon: const Icon(Icons.push_pin_outlined, size: 20),
              onPressed: () => engine.togglePin(result),
            ),
          ],
        ),
      ),
    );
  }
}