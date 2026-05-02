import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_signal_clarity_model.dart';

class GlobalSearchSignalClarityBanner extends StatelessWidget {
  final GlobalSearchSignalClarityModel model;

  const GlobalSearchSignalClarityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.totalResults == 0) return const SizedBox.shrink();

    final color = model.strongResults >= (model.totalResults / 2)
        ? Colors.green
        : model.strongResults >= 1
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
        '${model.label} • ${model.strongResults}/${model.totalResults}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}