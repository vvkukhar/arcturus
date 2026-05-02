import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/purchase_flow_confirm_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_flow_provider.dart';

class PurchaseFlowScreen extends ConsumerWidget {
  const PurchaseFlowScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(watchlistPurchaseFlowProvider);
    final confirmed = ref.watch(purchaseFlowConfirmProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchase Flow'),
      ),
      body: items.isEmpty
          ? const Center(child: Text('Purchase flow is empty.'))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: items.map((item) {
                final isConfirmed = confirmed.contains(item.id);

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
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            if (isConfirmed)
                              const Text(
                                'CONFIRMED',
                                style: TextStyle(
                                  color: Colors.green,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Target ${item.targetPrice} • Market ${item.marketPrice}',
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          children: [
                            FilledButton(
                              onPressed: () {
                                ref
                                    .read(purchaseFlowConfirmProvider.notifier)
                                    .confirm(item.id);
                              },
                              child: const Text('Confirm buy'),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(purchaseFlowConfirmProvider.notifier)
                                    .unconfirm(item.id);
                              },
                              child: const Text('Undo'),
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