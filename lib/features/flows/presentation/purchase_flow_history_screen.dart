import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';

class PurchaseFlowHistoryScreen extends ConsumerWidget {
  const PurchaseFlowHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flow = ref.watch(purchaseFlowProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Purchase History')),
      ),
      body: flow.when(
        data: (items) {
          final filtered =
              items.where((item) => item.status == 'bought').toList();
          if (filtered.isEmpty) {
            return Center(child: Text(i18n.t('No purchase history')));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final item = filtered[index];
              return Card(
                child: ListTile(
                  title: Text(item.watchlistItemId),
                  subtitle: Text(item.status),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('${i18n.t('common.error', {'error': error.toString()})}')),
      ),
    );
  }
}