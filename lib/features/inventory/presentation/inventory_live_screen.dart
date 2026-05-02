import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/decisions/data/decisions_api_repository_provider.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_api_repository_provider.dart';
import 'package:lego_trading_manager/features/market/data/market_api_repository_provider.dart';

class InventoryLiveScreen extends ConsumerStatefulWidget {
  const InventoryLiveScreen({super.key});

  @override
  ConsumerState<InventoryLiveScreen> createState() =>
      _InventoryLiveScreenState();
}

class _InventoryLiveScreenState extends ConsumerState<InventoryLiveScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _future = ref.read(inventoryApiRepositoryProvider).getInventory();
  }

  Future<void> _reload() async {
    setState(() {
      _future = ref.read(inventoryApiRepositoryProvider).getInventory();
    });
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    final repository = ref.watch(inventoryApiRepositoryProvider);
    final marketRepository = ref.watch(marketApiRepositoryProvider);
    final decisionsRepository = ref.watch(decisionsApiRepositoryProvider);
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Inventory Live')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final items = snapshot.data ?? [];

          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: const [
                  SizedBox(height: 250),
                  Center(child: Text('No inventory')),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _reload,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['titleSnapshot']?.toString() ?? '',
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Cost: ${item['totalCost']} • Expected: ${item['expectedSalePriceManual']}',
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            FilledButton(
                              onPressed: () async {
                                await repository.addToRepriceFlow(
                                  item['id'].toString(),
                                );

                                if (!mounted) return;
                                scaffoldMessenger.showSnackBar(
                                  const SnackBar(
                                    content: Text('Added to reprice flow'),
                                  ),
                                );
                              },
                              child: const Text('Reprice'),
                            ),
                            TextButton(
                              onPressed: () async {
                                await repository.addToReviewFlow(
                                  item['id'].toString(),
                                  'Manual review',
                                );

                                if (!mounted) return;
                                scaffoldMessenger.showSnackBar(
                                  const SnackBar(
                                    content: Text('Added to review flow'),
                                  ),
                                );
                              },
                              child: const Text('Review'),
                            ),
                            FilledButton.tonal(
                              onPressed: () async {
                                await marketRepository.refreshInventoryItem(
                                  item['id'].toString(),
                                );
                                await decisionsRepository
                                    .recomputeInventoryDecision(
                                  item['id'].toString(),
                                );
                                await _reload();

                                if (!mounted) return;
                                scaffoldMessenger.showSnackBar(
                                  const SnackBar(
                                    content: Text('Inventory item refreshed'),
                                  ),
                                );
                              },
                              child: const Text('Refresh'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}