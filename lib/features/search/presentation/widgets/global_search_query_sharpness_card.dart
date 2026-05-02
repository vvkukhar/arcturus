import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_sharpness_model.dart';

class GlobalSearchQuerySharpnessCard extends StatelessWidget {
  final GlobalSearchQuerySharpnessModel model;

  const GlobalSearchQuerySharpnessCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.queryLength == 0) return const SizedBox.shrink();

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
              'len ${model.queryLength}',
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