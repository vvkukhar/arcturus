import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_section_model.dart';

class GlobalSearchSectionWinnerBanner extends StatelessWidget {
  final GlobalSearchWeightedSectionModel? model;

  const GlobalSearchSectionWinnerBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.blue.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        'Winning section: ${model!.title} • ${model!.count} hits • ${model!.totalScore} score',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}