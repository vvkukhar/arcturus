import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/review_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';
import 'package:lego_trading_manager/features/flows/presentation/widgets/review_reason_presets_bar.dart';

class ReviewFlowScreen extends ConsumerStatefulWidget {
  const ReviewFlowScreen({super.key});

  @override
  ConsumerState<ReviewFlowScreen> createState() => _ReviewFlowScreenState();
}

class _ReviewFlowScreenState extends ConsumerState<ReviewFlowScreen> {
  Future<void> _reload() async {
    ref.invalidate(reviewFlowProvider);
    await ref.read(reviewFlowProvider.future);
  }

  @override
  Widget build(BuildContext context) {
    final flow = ref.watch(reviewFlowProvider);
    final repo = ref.watch(flowsApiRepositoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Review Flow'),
      ),
      body: flow.when(
        data: (items) {
          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: const [
                  SizedBox(height: 250),
                  Center(child: Text('Review flow is empty')),
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
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text('Status: ${item.status}'),
                        const SizedBox(height: 10),
                        FilledButton(
                          onPressed: item.status == 'reviewed'
                              ? null
                              : () async {
                                  final noteController =
                                      TextEditingController();

                                  await showDialog<void>(
                                    context: context,
                                    builder: (dialogContext) {
                                      return AlertDialog(
                                        title: const Text('Mark Reviewed'),
                                        content: StatefulBuilder(
                                          builder: (context, setLocalState) {
                                            return Column(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                TextField(
                                                  controller: noteController,
                                                  decoration:
                                                      const InputDecoration(
                                                    labelText: 'Note',
                                                  ),
                                                ),
                                                const SizedBox(height: 12),
                                                ReviewReasonPresetsBar(
                                                  onSelect: (value) {
                                                    noteController.text = value;
                                                    setLocalState(() {});
                                                  },
                                                ),
                                              ],
                                            );
                                          },
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () {
                                              Navigator.of(dialogContext).pop();
                                            },
                                            child: const Text('Cancel'),
                                          ),
                                          FilledButton(
                                            onPressed: () async {
                                              final navigator =
                                                  Navigator.of(dialogContext);
                                              final messenger =
                                                  ScaffoldMessenger.of(context);

                                              navigator.pop();

                                              await repo.markReviewed(
                                                id: item.id,
                                                note: noteController.text,
                                              );

                                              await _reload();
                                              if (!mounted) {
                                                return;
                                              }

                                              messenger.showSnackBar(
                                                const SnackBar(
                                                  content:
                                                      Text('Marked reviewed'),
                                                ),
                                              );
                                            },
                                            child: const Text('Confirm'),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                },
                          child: const Text('Mark reviewed'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, _) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}