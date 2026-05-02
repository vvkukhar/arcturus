import 'package:flutter/material.dart';

class PurchasesEmptyStateCard extends StatelessWidget {
  final VoidCallback onAddPurchase;

  const PurchasesEmptyStateCard({
    super.key,
    required this.onAddPurchase,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.shopping_bag_outlined, size: 42),
              const SizedBox(height: 12),
              const Text(
                'No purchases yet',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Create your first purchase record to track buy cost, shipping, source and payment method.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onAddPurchase,
                icon: const Icon(Icons.add),
                label: const Text('Add Purchase'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}