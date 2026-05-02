import 'package:flutter/material.dart';

class SalesEmptyStateCard extends StatelessWidget {
  final VoidCallback onAddSale;

  const SalesEmptyStateCard({
    super.key,
    required this.onAddSale,
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
              const Icon(Icons.point_of_sale_outlined, size: 42),
              const SizedBox(height: 12),
              const Text(
                'No sales yet',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Create your first sale record to track revenue, fees, shipping and net profit.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onAddSale,
                icon: const Icon(Icons.add),
                label: const Text('Add Sale'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}