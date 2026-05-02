import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_confidence_mix_model.dart';

class GlobalSearchConfidenceMixCard extends StatelessWidget {
  final GlobalSearchConfidenceMixModel model;

  const GlobalSearchConfidenceMixCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Exact ${model.exact}')),
            Chip(label: Text('Strong ${model.strong}')),
            Chip(label: Text('Good ${model.good}')),
            Chip(label: Text('Loose ${model.loose}')),
          ],
        ),
      ),
    );
  }
}
