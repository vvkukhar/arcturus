import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';

class GlobalSearchPinnedResultCard extends StatelessWidget {
  final GlobalSearchPinnedResultModel item;
  final VoidCallback onTap;
  final VoidCallback onUnpin;

  const GlobalSearchPinnedResultCard({
    super.key,
    required this.item,
    required this.onTap,
    required this.onUnpin,
  });

  IconData _icon() {
    switch (item.type) {
      case 'inventory':
        return Icons.inventory_2_outlined;
      case 'watchlist':
        return Icons.bookmark_outline;
      case 'purchase':
        return Icons.shopping_cart_outlined;
      case 'sale':
        return Icons.sell_outlined;
      case 'market':
        return Icons.query_stats_outlined;
      default:
        return Icons.push_pin_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(_icon()),
        title: Text(item.title),
        subtitle: Text(item.subtitle),
        trailing: IconButton(
          onPressed: onUnpin,
          icon: const Icon(Icons.push_pin),
        ),
        onTap: onTap,
      ),
    );
  }
}
