import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/purchase_flow_confirm_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_flow_provider.dart';

class PurchaseFlowScreen extends ConsumerWidget {
  const PurchaseFlowScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(watchlistPurchaseFlowProvider);
    final confirmed = ref.watch(purchaseFlowConfirmProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Purchase Flow')),
      ),
      body: items.isEmpty
          ? Center(child: Text(i18n.t('Purchase flow is empty.')))
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
                              Text(
                                i18n.t('CONFIRMED'),
                                style: const TextStyle(
                                  color: Colors.green,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${i18n.t('Target')} ${item.targetPrice} • ${i18n.t('Market')} ${item.marketPrice}',
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
                              child: Text(i18n.t('Confirm buy')),
                            ),
                            TextButton(
                              onPressed: () {
                                ref
                                    .read(purchaseFlowConfirmProvider.notifier)
                                    .unconfirm(item.id);
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