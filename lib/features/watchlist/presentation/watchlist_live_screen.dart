import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/decisions/data/decisions_api_repository_provider.dart';
import 'package:lego_trading_manager/features/market/data/market_api_repository_provider.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_api_repository_provider.dart';

class WatchlistLiveScreen extends ConsumerStatefulWidget {
  const WatchlistLiveScreen({super.key});

  @override
  ConsumerState<WatchlistLiveScreen> createState() =>
      _WatchlistLiveScreenState();
}

class _WatchlistLiveScreenState extends ConsumerState<WatchlistLiveScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(watchlistApiRepositoryProvider).getWatchlist();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(watchlistApiRepositoryProvider).getWatchlist();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final repository = ref.watch(watchlistApiRepositoryProvider);
    final marketRepository = ref.watch(marketApiRepositoryProvider);
    final decisionsRepository = ref.watch(decisionsApiRepositoryProvider);
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('Watchlist Live'))),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('${i18n.t('common.error', {'error': snapshot.error.toString()})}'));
          }

          final items = snapshot.data ?? [];

          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: [
                  const SizedBox(height: 250),
                  Center(child: Text(i18n.t('No watchlist items'))),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _reload,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                final id = item['id']?.toString() ?? '';

                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['titleSnapshot']?.toString() ?? '',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Max: ${item['maxBuyPrice']} • Target: ${item['targetSellPrice']}',
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            FilledButton(
                              onPressed: id.isEmpty
                                  ? null
                                  : () async {
                                      await repository.addToPurchaseFlow(id);

                                      if (!mounted) return;
                                      scaffoldMessenger.showSnackBar(
                                        SnackBar(
                                          content:
                                              Text(i18n.t('Added to purchase flow')),
                                        ),
                                      );
                                    },
                              child: Text(i18n.t('Buy')),
                            ),
                            FilledButton.tonal(
                              onPressed: id.isEmpty
                                  ? null
                                  : () async {
                                      await marketRepository
                                          .refreshWatchlistItem(id);
                                      await decisionsRepository
                                          .recomputeWatchlistDecision(id);
                                      await _reload();

                                      if (!mounted) return;
                                      scaffoldMessenger.showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            i18n.t('Watchlist item refreshed'),
                                          ),
                                        ),
                                      );
                                    },
                              child: Text(i18n.t('Refresh')),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}