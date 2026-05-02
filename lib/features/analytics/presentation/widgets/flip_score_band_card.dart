// lib/features/analytics/presentation/widgets/flip_score_band_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_band_model.dart';

class FlipScoreBandCard extends StatelessWidget {
  final FlipScoreBandModel band;

  const FlipScoreBandCard({
    super.key,
    required this.band,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(band.label),
        trailing: Text(
          band.count.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
