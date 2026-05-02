import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_section_model.dart';

class GlobalSearchWeightedSectionsBar extends StatelessWidget {
  final List<GlobalSearchWeightedSectionModel> items;

  const GlobalSearchWeightedSectionsBar({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: items.take(5).map((item) {
            return Chip(
              label: Text('${item.title}: ${item.count} • ${item.totalScore}'),
            );
          }).toList(),
        ),
      ),
    );
  }
}