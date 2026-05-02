import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_card_v2.dart';

class WatchlistAllItemsSection extends StatelessWidget {
  final List<WatchlistItemModel> items;
  final String? Function(String id) priorityLabelFor;
  final String? Function(String id) smartRankLabelFor;
  final void Function(WatchlistItemModel item) onOpenDetails;
  final void Function(WatchlistItemModel item) onCreatePurchase;
  final void Function(WatchlistItemModel item) onSaveReport;

  const WatchlistAllItemsSection({
    super.key,
    required this.items,
    required this.priorityLabelFor,
    required this.smartRankLabelFor,
    required this.onOpenDetails,
    required this.onCreatePurchase,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'All Watchlist Items',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 12),
        ...items.map((item) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: WatchlistCardV2(
              item: item,
              priorityLabel: priorityLabelFor(item.id),
              smartRankLabel: smartRankLabelFor(item.id),
              onOpenDetails: () => onOpenDetails(item),
              onCreatePurchase: () => onCreatePurchase(item),
              onSaveReport: () => onSaveReport(item),
            ),
          );
        }),
      ],
    );
  }
}