import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';

class GlobalSearchPinnedResults extends StatelessWidget {
  final List<GlobalSearchPinnedResultModel> items;
  final void Function(GlobalSearchPinnedResultModel item) onTap;
  final void Function(GlobalSearchPinnedResultModel item) onUnpin;

  const GlobalSearchPinnedResults({
    super.key,
    required this.items,
    required this.onTap,
    required this.onUnpin,
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
              'Pinned Results',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 10),
            ...items.map(
              (item) => ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(item.title),
                subtitle: Text(item.subtitle),
                trailing: IconButton(
                  onPressed: () => onUnpin(item),
                  icon: const Icon(Icons.push_pin_outlined),
                ),
                onTap: () => onTap(item),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
