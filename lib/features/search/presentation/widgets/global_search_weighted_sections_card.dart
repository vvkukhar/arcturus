import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_section_model.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_section_score_badge.dart';

class GlobalSearchWeightedSectionsCard extends StatelessWidget {
  final List<GlobalSearchWeightedSectionModel> items;

  const GlobalSearchWeightedSectionsCard({
    super.key,
    required this.items,
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
              'Section Strength',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text('${item.title} • ${item.count}'),
                        ),
                        GlobalSearchSectionScoreBadge(score: item.totalScore),
                      ],
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}