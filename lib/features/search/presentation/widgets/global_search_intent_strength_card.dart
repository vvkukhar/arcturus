import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_intent_strength_model.dart';

class GlobalSearchIntentStrengthCard extends StatelessWidget {
  final GlobalSearchIntentStrengthModel model;

  const GlobalSearchIntentStrengthCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.resultsCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              '${model.resultsCount} / ${model.exactCount}',
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
