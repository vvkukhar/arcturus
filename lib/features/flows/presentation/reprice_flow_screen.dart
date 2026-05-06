import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
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
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('flow.reprice.title'))),
      body: flow.when(
        data: (items) {
          if (items.isEmpty) {
            return RefreshIndicator(
              onRefresh: _reload,
              child: ListView(
                children: [
                  const SizedBox(height: 250),
                  Center(child: Text(i18n.t('flow.reprice.empty'))),
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
                        Text('${i18n.t('flow.purchase.status')} ${item.status}'),
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
                                        title: Text(i18n.t('flow.reprice.markListed')),
                                        content: TextField(
                                          controller: priceController,
                                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                          decoration: InputDecoration(labelText: i18n.t('flow.reprice.listingPrice')),
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.of(dialogContext).pop(),
                                            child: Text(i18n.t('flow.purchase.cancel')),
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
                                                SnackBar(content: Text(i18n.t('flow.reprice.marked'))),
                                              );
                                            },
                                            child: Text(i18n.t('flow.purchase.confirm')),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                },
                          child: Text(i18n.t('flow.reprice.markListed')),
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
        error: (error, _) => Center(child: Text('${i18n.t('common.error', {'error': error.toString()})}')),
      ),
    );
  }
}