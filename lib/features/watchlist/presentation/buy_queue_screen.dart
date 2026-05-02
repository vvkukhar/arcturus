import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_top_buy_candidates_provider.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_buy_queue_action_bar.dart';

class BuyQueueScreen extends ConsumerWidget {
  const BuyQueueScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(watchlistTopBuyCandidatesProvider);
    final watchlistState = ref.watch(watchlistControllerProvider);
    final watchlistItems = watchlistState.allItems;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Buy Queue'),
      ),
      body: items.isEmpty
          ? const Center(
              child: Text('No buy candidates right now.'),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = items[index];
                final source = watchlistItems.firstWhere(
                  (entry) => entry.id == item.id,
                );

                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Text(
                              item.score.toStringAsFixed(0),
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(item.reason),
                        const SizedBox(height: 10),
                        WatchlistBuyQueueActionBar(
                          onAddToPurchaseFlow: () {
                            ref
                                .read(watchlistPurchaseFlowProvider.notifier)
                                .addItem(
                                  WatchlistPurchaseFlowItemModel(
                                    id: source.id,
                                    title: source.title,
                                    targetPrice: source.maxBuyPrice,
                                    marketPrice:
                                        source.marketPrice ?? source.maxBuyPrice,
                                  ),
                                );

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  '${source.title} added to purchase flow',
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}