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
      appBar: AppBar(title: const Text('Watchlist')),
      drawer: const AppDrawer(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) => ListView.builder(
          itemCount: state.visibleItems.length,
          itemBuilder: (context, index) {
            final item = state.visibleItems[index];
            return ListTile(title: Text(item.title));
          },
        ),
      ),
    );
  }
}