import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_engine.dart';

class WatchlistScreen extends ConsumerWidget {
  const WatchlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(watchlistEngineProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Watchlist', style: TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          if (state.visibleItems.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.visibility_outlined, size: 64, color: Colors.white24),
                  SizedBox(height: 16),
                  Text('Watchlist is empty', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  SizedBox(height: 8),
                  Text('Add targets to monitor market prices.', style: TextStyle(color: Colors.white38)),
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
                  subtitle: Text('Target: ${item.desiredBuyPrice}', style: const TextStyle(color: Colors.white70)),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: item.isActive ? Colors.blueAccent.withValues(alpha: 0.15) : Colors.grey.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8)
                    ),
                    child: Text(item.isActive ? 'ACTIVE' : 'PAUSED', style: TextStyle(color: item.isActive ? Colors.blueAccent : Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
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