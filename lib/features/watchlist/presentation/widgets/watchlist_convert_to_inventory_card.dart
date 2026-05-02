import 'package:flutter/material.dart';

class WatchlistConvertToInventoryCard extends StatelessWidget {
  final VoidCallback onConvert;
  final bool isActive;

  const WatchlistConvertToInventoryCard({
    super.key,
    required this.onConvert,
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
                const Icon(Icons.inventory_2_outlined),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Convert to Inventory',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              isActive
                  ? 'Create an inventory item from this watchlist record and automatically deactivate the source watchlist item.'
                  : 'This watchlist item is already inactive, but you can still convert it into inventory.',
              style: const TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: onConvert,
                icon: const Icon(Icons.arrow_forward),
                label: const Text('Convert Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}