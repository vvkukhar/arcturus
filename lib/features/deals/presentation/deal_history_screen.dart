import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deals_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DealHistoryScreen extends ConsumerWidget {
  const DealHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(dealsEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('history.title'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep, color: Colors.redAccent),
            onPressed: () => ref.read(dealsEngineProvider.notifier).clearHistory(),
          )
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (deals) {
          if (deals.isEmpty) return Center(child: Text(i18n.t('history.empty'), style: const TextStyle(color: Colors.white54)));

          return ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: deals.length,
            itemBuilder: (context, index) {
              final deal = deals[index];
              final isGood = deal.verdict == 'strong buy' || deal.verdict == 'good';
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: ListTile(
                  title: Text(deal.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Ask: ${deal.askingPrice} • Profit: ${deal.expectedProfit.toStringAsFixed(0)}'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: isGood ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                    child: Text(deal.verdict.toUpperCase(), style: TextStyle(color: isGood ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 10)),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}