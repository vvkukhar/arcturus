import 'package:flutter/material.dart';

class ItemQuickDecisionBar extends StatelessWidget {
  final VoidCallback onSetMarket;
  final VoidCallback onMinus5;
  final VoidCallback onMoveNext;
  final VoidCallback onMovePrevious;

  const ItemQuickDecisionBar({
    super.key,
    required this.onSetMarket,
    required this.onMinus5,
    required this.onMoveNext,
    required this.onMovePrevious,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonal(
              onPressed: onSetMarket,
              child: const Text('Set = Market'),
            ),
            FilledButton.tonal(
              onPressed: onMinus5,
              child: const Text('Market -5%'),
            ),
            FilledButton.tonal(
              onPressed: onMovePrevious,
              child: const Text('Prev Status'),
            ),
            FilledButton(
              onPressed: onMoveNext,
              child: const Text('Next Status'),
            ),
          ],
        ),
      ),
    );
  }
}