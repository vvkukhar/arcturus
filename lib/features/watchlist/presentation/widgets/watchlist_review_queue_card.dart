import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_priority_badge.dart';

class WatchlistReviewQueueCard extends StatelessWidget {
  final List<WatchlistItemModel> items;
  final Set<String> selectedIds;
  final ValueChanged<String> onToggleSelected;
  final VoidCallback onOpenWatchlist;
  final VoidCallback onOpenOpportunities;
  final void Function(WatchlistItemModel item) onOpen;
  final void Function(WatchlistItemModel item)? onQuickBuy;

  const WatchlistReviewQueueCard({
    super.key,
    required this.items,
    required this.selectedIds,
    required this.onToggleSelected,
    required this.onOpenWatchlist,
    required this.onOpenOpportunities,
    required this.onOpen,
    this.onQuickBuy,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text('No review queue items right now.'),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Review Queue',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            WatchlistReviewQueueActionBar(
              count: items.length,
              onOpenWatchlist: onOpenWatchlist,
              onOpenOpportunities: onOpenOpportunities,
            ),
            const SizedBox(height: 10),
            ...items.map(
              (item) {
                final selected = selectedIds.contains(item.id);
                final market = item.marketPrice;

                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: CheckboxListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    value: selected,
                    onChanged: (_) => onToggleSelected(item.id),
                    title: Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        if (market != null)
                          WatchlistReviewQueuePriorityBadge(
                            market: market,
                            max: item.maxBuyPrice,
                          ),
                      ],
                    ),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Text(
                        'Market ${market?.toStringAsFixed(2) ?? '-'} / Max ${item.maxBuyPrice.toStringAsFixed(2)}',
                      ),
                    ),
                    secondary: IconButton(
                      onPressed: () => onOpen(item),
                      icon: const Icon(Icons.open_in_new),
                    ),
                    controlAffinity: ListTileControlAffinity.leading,
                  ),
                );
              },
            ),
            if (onQuickBuy != null) ...[
              const SizedBox(height: 6),
              const Text(
                'Use item cards above for selection. Open item for full review or buy selected from batch bar.',
                style: TextStyle(color: Colors.white70),
              ),
            ],
          ],
        ),
      ),
    );
  }
}