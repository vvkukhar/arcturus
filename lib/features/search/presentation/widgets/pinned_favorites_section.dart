import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';

class PinnedFavoritesSection extends StatelessWidget {
  final List<GlobalSearchPinnedResultModel> items;
  final void Function(GlobalSearchPinnedResultModel item) onOpen;

  const PinnedFavoritesSection({
    super.key,
    required this.items,
    required this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Pinned Favorites',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(item.title),
                    subtitle: Text(item.subtitle),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => onOpen(item),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}