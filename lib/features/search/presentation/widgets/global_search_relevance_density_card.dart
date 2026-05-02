import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_relevance_density_model.dart';

class GlobalSearchRelevanceDensityCard extends StatelessWidget {
  final GlobalSearchRelevanceDensityModel model;

  const GlobalSearchRelevanceDensityCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.ratio == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            Text(
              model.ratio.toStringAsFixed(2),
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
          ],
        ),
      ),
    );
  }
}