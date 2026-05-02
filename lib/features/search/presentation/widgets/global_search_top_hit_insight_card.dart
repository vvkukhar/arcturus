import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_hit_insight_model.dart';

class GlobalSearchTopHitInsightCard extends StatelessWidget {
  final GlobalSearchTopHitInsightModel? model;

  const GlobalSearchTopHitInsightCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                'Top-hit quality: ${model!.level}',
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              model!.score.toString(),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}