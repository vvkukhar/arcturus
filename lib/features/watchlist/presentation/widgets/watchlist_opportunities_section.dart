import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_card_v2.dart';

class WatchlistOpportunitiesSection extends StatelessWidget {
  final List<WatchlistOpportunityModel> opportunities;
  final void Function(WatchlistOpportunityModel item) onQuickBuy;
  final void Function(WatchlistOpportunityModel item) onOpen;

  const WatchlistOpportunitiesSection({
    super.key,
    required this.opportunities,
    required this.onQuickBuy,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    if (opportunities.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Opportunities',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 12),
        ...opportunities.take(5).map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: WatchlistOpportunityCardV2(
                  item: item,
                  onQuickBuy: () => onQuickBuy(item),
                  onOpenWatchlist: () => onOpen(item),
                ),
              ),
            ),
      ],
    );
  }
}