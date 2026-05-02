import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_section_dominance_model.dart';

class GlobalSearchSectionDominanceBanner extends StatelessWidget {
  final GlobalSearchSectionDominanceModel? model;

  const GlobalSearchSectionDominanceBanner({
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
        color: Colors.indigo.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model!.label} • ${model!.winnerScore}/${model!.runnerUpScore}',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}