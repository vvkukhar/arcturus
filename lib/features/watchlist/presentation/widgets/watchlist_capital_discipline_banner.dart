import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_model.dart';

class WatchlistCapitalDisciplineBanner extends StatelessWidget {
  final WatchlistCapitalDisciplineModel model;

  const WatchlistCapitalDisciplineBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.ratio <= 1 ? Colors.green : Colors.orange;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.ratio.toStringAsFixed(2)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}