import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/sales/application/sales_engine.dart';

class SalesScreen extends ConsumerWidget {
  const SalesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(salesEngineProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Sales', style: TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          if (state.visibleSales.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.point_of_sale_outlined, size: 64, color: Colors.white24),
                  SizedBox(height: 16),
                  Text('No sales yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                  SizedBox(height: 8),
                  Text('Record your first sale to see profits.', style: TextStyle(color: Colors.white38)),
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