import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_filter_model.dart';

class SalesActiveFilterChips extends StatelessWidget {
  final SalesFilterModel filter;

  const SalesActiveFilterChips({
    super.key,
    required this.filter,
  });

  @override
  Widget build(BuildContext context) {
    final chips = <String>[];

    if ((filter.platformContains ?? '').trim().isNotEmpty) {
      chips.add('platform: ${filter.platformContains}');
    }

    if ((filter.buyerContains ?? '').trim().isNotEmpty) {
      chips.add('buyer: ${filter.buyerContains}');
    }

    if (filter.minNet != null) {
      chips.add('min net: ${filter.minNet!.toStringAsFixed(2)}');
    }

    if (filter.maxNet != null) {
      chips.add('max net: ${filter.maxNet!.toStringAsFixed(2)}');
    }

    if (chips.isEmpty) return const SizedBox.shrink();

    return Align(
      alignment: Alignment.centerLeft,
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: chips
            .map(
              (text) => Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.white10,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(text),
              ),
            )
            .toList(),
      ),
    );
  }
}