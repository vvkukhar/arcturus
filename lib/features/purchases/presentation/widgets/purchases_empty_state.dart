import 'package:flutter/material.dart';

class PurchasesEmptyState extends StatelessWidget {
  final VoidCallback onAdd;

  const PurchasesEmptyState({
    super.key,
    required this.onAdd,
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
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Record bought LEGO items, sources, shipping and final cost.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onAdd,
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