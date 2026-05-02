import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_explainer_card.dart';

class WatchlistPrioritySection extends StatelessWidget {
  final List<WatchlistPriorityModel> priorities;
  final WatchlistItemModel? Function(String id) resolveSource;
  final void Function(WatchlistItemModel item) onQuickBuy;
  final void Function(WatchlistItemModel item) onReview;

  const WatchlistPrioritySection({
    super.key,
    required this.priorities,
    required this.resolveSource,
    required this.onQuickBuy,
    required this.onReview,
  });

  @override
  Widget build(BuildContext context) {
    if (priorities.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Priority Queue',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 12),
        const WatchlistPriorityExplainerCard(),
        const SizedBox(height: 12),
        ...priorities.take(5).map((priority) {
          final source = resolveSource(priority.id);

          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: WatchlistPriorityCard(
              model: priority,
              onQuickBuy: source == null ? null : () => onQuickBuy(source),
              onReview: source == null ? null : () => onReview(source),
            ),
          );
        }),
      ],
    );
  }
}