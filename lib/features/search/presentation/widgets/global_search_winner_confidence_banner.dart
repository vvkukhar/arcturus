import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_winner_confidence_model.dart';

class GlobalSearchWinnerConfidenceBanner extends StatelessWidget {
  final GlobalSearchWinnerConfidenceModel? model;

  const GlobalSearchWinnerConfidenceBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();

    final color = model!.topScore >= 700
        ? Colors.green
        : model!.topScore >= 500
            ? Colors.orange
            : Colors.redAccent;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model!.label} • ${model!.topScore}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}