import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_select_all_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_batch_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_review_queue_card.dart';

class WatchlistReviewQueueSection extends StatelessWidget {
  final List<WatchlistItemModel> reviewQueue;
  final Set<String> selectedIds;
  final VoidCallback onSelectAll;
  final VoidCallback onClearSelection;
  final VoidCallback onBuySelected;
  final ValueChanged<String> onToggleSelected;
  final void Function(WatchlistItemModel item) onOpen;
  final void Function(WatchlistItemModel item) onQuickBuy;
  final VoidCallback onOpenOpportunities;

  const WatchlistReviewQueueSection({
    super.key,
    required this.reviewQueue,
    required this.selectedIds,
    required this.onSelectAll,
    required this.onClearSelection,
    required this.onBuySelected,
    required this.onToggleSelected,
    required this.onOpen,
    required this.onQuickBuy,
    required this.onOpenOpportunities,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        WatchlistQueueSelectAllBar(
          total: reviewQueue.length,
          onSelectAll: onSelectAll,
          onClear: onClearSelection,
        ),
        const SizedBox(height: 8),
        WatchlistReviewQueueBatchBar(
          selectedCount: selectedIds.length,
          onBuySelected: onBuySelected,
          onClear: onClearSelection,
        ),
        const SizedBox(height: 12),
        WatchlistReviewQueueCard(
          items: reviewQueue,
          selectedIds: selectedIds,
          onToggleSelected: onToggleSelected,
          onOpenWatchlist: () {},
          onOpenOpportunities: onOpenOpportunities,
          onOpen: onOpen,
          onQuickBuy: onQuickBuy,
        ),
      ],
    );
  }
}