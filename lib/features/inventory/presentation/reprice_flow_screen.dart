import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/reprice_flow_done_provider.dart';

class RepriceFlowScreen extends ConsumerWidget {
  const RepriceFlowScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(inventoryRepriceFlowProvider);
    final done = ref.watch(repriceFlowDoneProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Reprice Flow')),
      ),
      body: items.isEmpty
          ? Center(child: Text(i18n.t('Reprice flow is empty.')))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: items.map((item) {
                final isDone = done.contains(item.itemId);
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            if (isDone)
                              Text(
                                i18n.t('DONE'),
                                style: const TextStyle(
                                  color: Colors.green,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(i18n.t(item.reason)),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          children: [
                            FilledButton(
                              onPressed: () {
                                ref
                                    .read(repriceFlowDoneProvider.notifier)
                                    .markDone(item.itemId);
                              },
                              child: Text(i18n.t('Mark done')),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(repriceFlowDoneProvider.notifier)
                                    .unmark(item.itemId);
                              },
                              child: Text(i18n.t('Undo')),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
    );
  }
}