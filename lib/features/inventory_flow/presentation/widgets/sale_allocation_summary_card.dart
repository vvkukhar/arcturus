import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_model.dart';

class SaleAllocationSummaryCard extends StatelessWidget {
  final SaleAllocationSummaryModel model;
  final String currency;
  final VoidCallback onAllocate;
  final VoidCallback? onClearAllocation;

  const SaleAllocationSummaryCard({
    super.key,
    required this.model,
    required this.currency,
    required this.onAllocate,
    this.onClearAllocation,
  });

  @override
  Widget build(BuildContext context) {
    if (!model.hasAllocation) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const Row(
                children: [
                  Icon(Icons.inventory_2_outlined),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'No stock allocated',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              const Text(
                'Allocate purchase stock to this sale to track real stock movement and unit cost.',
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onAllocate,
                  icon: const Icon(Icons.add_link_outlined),
                  label: const Text('Allocate Stock'),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Row(
              children: [
                Icon(Icons.inventory_2_outlined),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Stock Allocation',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Expanded(child: Text('Allocated quantity')),
                Text(
                  model.allocatedQuantity.toString(),
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Expanded(child: Text('Allocated cost')),
                Text(
                  '${model.allocatedCost.toStringAsFixed(2)} $currency',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: FilledButton.tonalIcon(
                    onPressed: onAllocate,
                    icon: const Icon(Icons.swap_horiz_outlined),
                    label: const Text('Change Allocation'),
                  ),
                ),
                if (onClearAllocation != null) ...[
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onClearAllocation,
                      icon: const Icon(Icons.clear_outlined),
                      label: const Text('Clear'),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}