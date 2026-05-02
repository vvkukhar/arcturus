// lib/features/partout/presentation/widgets/partout_active_filter_chips.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';

class PartOutActiveFilterChips extends StatelessWidget {
  final PartOutFilterModel filter;

  const PartOutActiveFilterChips({
    super.key,
    required this.filter,
  });

  @override
  Widget build(BuildContext context) {
    final chips = <String>[];

    if (filter.status != null) chips.add('status: ${filter.status!.name}');
    if ((filter.titleContains ?? '').trim().isNotEmpty) {
      chips.add('title: ${filter.titleContains}');
    }
    if (filter.onlyProfitableExpected) chips.add('expected profit');
    if (filter.onlyProfitableActual) chips.add('actual profit');
    if (filter.onlyWithNotes) chips.add('with notes');

    if (chips.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: chips
          .map(
            (chip) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.white10,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(chip),
            ),
          )
          .toList(),
    );
  }
}
