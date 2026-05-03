import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';

class RepriceFlowScreen extends ConsumerStatefulWidget {
  const RepriceFlowScreen({super.key});

  @override
  ConsumerState<RepriceFlowScreen> createState() => _RepriceFlowScreenState();
}

class _RepriceFlowScreenState extends ConsumerState<RepriceFlowScreen> {
  Future<void> _reload() async {
    ref.invalidate(repriceFlowProvider);
    await ref.read(repriceFlowProvider.future);
  }

  @override
  Widget build(BuildContext context) {
    final flow = ref.watch(repriceFlowProvider);
    final repo = ref.watch(flowsApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Reprice Flow')),
      body: flow.when(
        data: (items) {
          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: const [
                  SizedBox(height: 250),
                  Center(child: Text('Reprice flow is empty')),
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
                          item.inventoryItemId,
                          style: const TextStyle(fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 6),
                        Text('Status: ${item.status}'),
                        const SizedBox(height: 10),
                        FilledButton(
                          onPressed: item.status == 'listed'
                              ? null
                              : () async {
                                  final priceController = TextEditingController();

                                  await showDialog<void>(
                                    context: context,
                                    builder: (dialogContext) {
                                      return AlertDialog(
                                        title: const Text('Mark Listed'),
                                        content: TextField(
                                          controller: priceController,
                                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                          decoration: const InputDecoration(labelText: 'Listing price'),
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.of(dialogContext).pop(),
                                            child: const Text('Cancel'),
                                          ),
                                          FilledButton(
                                            onPressed: () async {
                                              final navigator = Navigator.of(dialogContext);
                                              final messenger = ScaffoldMessenger.of(context);
                                              navigator.pop();

                                              await repo.markListed(
                                                id: item.id,
                                                price: double.tryParse(priceController.text) ?? 0.0,
                                              );

                                              await _reload();
                                              if (!mounted) return;

                                              messenger.showSnackBar(
                                                const SnackBar(content: Text('Marked listed')),
                                              );
                                            },
                                            child: const Text('Confirm'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                },
                          child: const Text('Mark listed'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      ),
    );
  }
}