import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_integrity_provider.dart';

class AppDataHealthCard extends ConsumerWidget {
  const AppDataHealthCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final integrity = ref.watch(appDataIntegrityProvider);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  integrity.isHealthy
                      ? Icons.check_circle_outline
                      : Icons.warning_amber_outlined,
                  color: integrity.isHealthy ? Colors.green : Colors.red,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Data Integrity',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text('Purchases: ${integrity.purchasesCount}'),
            Text('Sales: ${integrity.salesCount}'),
            Text('Allocations: ${integrity.allocationsCount}'),
            Text('Links: ${integrity.linksCount}'),
            if (!integrity.isHealthy) ...[
              const Divider(),
              if (integrity.orphanAllocationsCount > 0)
                Text('Orphan allocations: ${integrity.orphanAllocationsCount}',
                    style: const TextStyle(color: Colors.red)),
              if (integrity.orphanLinksCount > 0)
                Text('Orphan links: ${integrity.orphanLinksCount}',
                    style: const TextStyle(color: Colors.red)),
              if (integrity.overAllocatedSalesCount > 0)
                Text('Overallocated sales: ${integrity.overAllocatedSalesCount}',
                    style: const TextStyle(color: Colors.red)),
              if (integrity.overSoldPurchasesCount > 0)
                Text('Oversold purchases: ${integrity.overSoldPurchasesCount}',
                    style: const TextStyle(color: Colors.red)),
            ],
          ],
        ),
      ),
    );
  }
}