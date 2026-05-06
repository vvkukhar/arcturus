import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';

class RepriceFlowHistoryScreen extends ConsumerWidget {
  const RepriceFlowHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flow = ref.watch(repriceFlowProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Reprice History')),
      ),
      body: flow.when(
        data: (items) {
          final filtered =
              items.where((item) => item.status == 'listed').toList();
          if (filtered.isEmpty) {
            return Center(child: Text(i18n.t('No reprice history')));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final item = filtered[index];
              return Card(
                child: ListTile(
                  title: Text(item.inventoryItemId),
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