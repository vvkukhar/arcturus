import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_review_candidates_provider.dart';

class InventoryTopReviewCandidatesCard extends StatelessWidget {
  final List<InventoryTopReviewCandidateModel> items;

  const InventoryTopReviewCandidatesCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text('No strong review candidates right now.'),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Top Review Candidates',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text('${item.title} • ${item.reason}'),
                        ),
                        Text(
                          item.score.toStringAsFixed(0),
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
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