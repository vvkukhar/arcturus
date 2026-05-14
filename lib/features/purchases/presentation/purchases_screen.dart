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
        data: (state) {
          if (state.visiblePurchases.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 64, color: Colors.white24),
                  SizedBox(height: 16),
                  Text('No purchases yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  SizedBox(height: 8),
                  Text('Record your first buy to track expenses.', style: TextStyle(color: Colors.white38)),
                ],
              ),
            );
          }

          return ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: state.visiblePurchases.length,
            itemBuilder: (context, index) {
              final p = state.visiblePurchases[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(p.source, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Total: ${p.finalTotal.toStringAsFixed(2)} ${p.currency}', style: const TextStyle(color: Colors.white70)),
                  trailing: const Icon(Icons.chevron_right, color: Colors.white30),
                ),
              );
            },
          );
        },
      ),
    );
  }
}