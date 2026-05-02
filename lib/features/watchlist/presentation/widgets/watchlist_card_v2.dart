import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_badge.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_reason_chips.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_quick_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_smart_rank_badge.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_status_chip.dart';

class WatchlistCardV2 extends StatelessWidget {
  final WatchlistItemModel item;
  final String? priorityLabel;
  final String? smartRankLabel;
  final VoidCallback onOpenDetails;
  final VoidCallback onCreatePurchase;
  final VoidCallback onSaveReport;

  const WatchlistCardV2({
    super.key,
    required this.item,
    this.priorityLabel,
    this.smartRankLabel,
    required this.onOpenDetails,
    required this.onCreatePurchase,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    final market = item.marketPrice;
    final marketLabel = market == null ? '-' : market.toStringAsFixed(2);
    final gap = item.maxBuyPrice - (market ?? item.maxBuyPrice);
    final spread = item.maxBuyPrice - item.desiredBuyPrice;

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
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                if (smartRankLabel != null) ...[
                  WatchlistSmartRankBadge(label: smartRankLabel!),
                  const SizedBox(width: 8),
                ],
                if (priorityLabel != null) ...[
                  WatchlistPriorityBadge(label: priorityLabel!),
                  const SizedBox(width: 8),
                ],
                WatchlistStatusChip(isActive: item.isActive),
              ],
            ),
            const SizedBox(height: 6),
            Text('${item.type.name} • ${item.theme ?? '-'}'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('Desired: ${item.desiredBuyPrice.toStringAsFixed(2)}'),
                Text('Max: ${item.maxBuyPrice.toStringAsFixed(2)}'),
                Text('Market: $marketLabel'),
                Text('Gap: ${gap.toStringAsFixed(2)}'),
              ],
            ),
            const SizedBox(height: 10),
            WatchlistPriorityReasonChips(
              spread: spread,
              gap: gap,
              active: item.isActive,
            ),
            if ((item.comment ?? '').trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                item.comment!.trim(),
                style: const TextStyle(color: Colors.white70),
              ),
            ],
            const SizedBox(height: 12),
            WatchlistQuickActionBar(
              onOpenDetails: onOpenDetails,
              onCreatePurchase: onCreatePurchase,
              onSaveReport: onSaveReport,
            ),
          ],
        ),
      ),
    );
  }
}