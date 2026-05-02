import 'package:flutter/material.dart';

class WatchlistQuickBuyCard extends StatelessWidget {
  final VoidCallback onPressed;
  final bool isActive;

  const WatchlistQuickBuyCard({
    super.key,
    required this.onPressed,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.shopping_cart_checkout_outlined),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Quick Buy',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              isActive
                  ? 'Convert this watchlist item into inventory and immediately open purchase recording flow.'
                  : 'This watchlist item is inactive, but you can still open purchase flow from it.',
              style: const TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: onPressed,
                icon: const Icon(Icons.arrow_forward),
                label: const Text('Open Purchase Flow'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}