import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_engine.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_item_form_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistScreen extends ConsumerWidget {
  const WatchlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(watchlistEngineProvider);
    final engine = ref.read(watchlistEngineProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('cc.watch'), style: const TextStyle(fontWeight: FontWeight.w900))),
      floatingActionButton: const GlobalQuickAddFab(), 
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          if (state.visibleItems.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.visibility_outlined, size: 64, color: Colors.white24),
                  const SizedBox(height: 16),
                  Text(i18n.t('watch.empty.title'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  const SizedBox(height: 8),
                  Text(i18n.t('watch.empty.sub'), style: const TextStyle(color: Colors.white38)),
                ],
              ),
            );
          }

          return ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: state.visibleItems.length,
            itemBuilder: (context, index) {
              final item = state.visibleItems[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${i18n.t('watch.target')}: ${item.desiredBuyPrice}', style: const TextStyle(color: Colors.white70)),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: item.isActive ? Colors.blueAccent.withValues(alpha: 0.15) : Colors.grey.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8)
                        ),
                        child: Text(item.isActive ? i18n.t('watch.active') : i18n.t('watch.paused'), style: TextStyle(color: item.isActive ? Colors.blueAccent : Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.redAccent),
                        onPressed: () => engine.deleteItem(item.id),
                      ),
                    ],
                  ),
                  onTap: () => Navigator.push(
                    context, 
                    MaterialPageRoute(builder: (_) => WatchlistItemFormScreen(item: item))
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}