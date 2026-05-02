import 'package:flutter/material.dart';

class ItemQuickRepriceCard extends StatelessWidget {
  final VoidCallback onMarket;
  final VoidCallback onMinus5;
  final VoidCallback onMinus10;
  final VoidCallback onPlus3;

  const ItemQuickRepriceCard({
    super.key,
    required this.onMarket,
    required this.onMinus5,
    required this.onMinus10,
    required this.onPlus3,
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
              onPressed: onMarket,
              child: const Text('Set = Market'),
            ),
            FilledButton.tonal(
              onPressed: onMinus5,
              child: const Text('Market -5%'),
            ),
            FilledButton.tonal(
              onPressed: onMinus10,
              child: const Text('Market -10%'),
            ),
            FilledButton.tonal(
              onPressed: onPlus3,
              child: const Text('Market +3%'),
            ),
          ],
        ),
      ),
    );
  }
}