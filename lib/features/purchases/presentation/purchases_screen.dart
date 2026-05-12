import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_engine.dart';

class PurchasesScreen extends ConsumerWidget {
  const PurchasesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(purchasesEngineProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Purchases', style: TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) => ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.visiblePurchases.length,
          itemBuilder: (context, index) {
            final p = state.visiblePurchases[index];
            return Card(
              color: const Color(0xFF171A21),
              child: ListTile(
                title: Text(p.source, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('Total: ${p.finalTotal} ${p.currency}'),
              ),
            );
          },
        ),
      ),
    );
  }
}