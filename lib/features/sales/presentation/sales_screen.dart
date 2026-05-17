import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/sales/application/sales_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SalesScreen extends ConsumerWidget {
  const SalesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(salesEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('sale.title'), style: const TextStyle(fontWeight: FontWeight.w900))),
      floatingActionButton: const GlobalQuickAddFab(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          if (state.visibleSales.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.point_of_sale_outlined, size: 64, color: Colors.white24),
                  const SizedBox(height: 16),
                  Text(i18n.t('sale.empty'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  const SizedBox(height: 8),
                  const Text('Record your first sale to see profits.', style: TextStyle(color: Colors.white38)),
                ],
              ),
            );
          }

          return ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: state.visibleSales.length,
            itemBuilder: (context, index) {
              final s = state.visibleSales[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(s.platform, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Net: ${s.finalNet.toStringAsFixed(2)} ${s.currency}', style: const TextStyle(color: Colors.white70)),
                  trailing: Text(s.saleDate.toIso8601String().split('T').first, style: const TextStyle(color: Colors.white54, fontSize: 12)),
                ),
              );
            },
          );
        },
      ),
    );
  }
}