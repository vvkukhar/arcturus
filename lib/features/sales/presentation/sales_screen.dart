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
        data: (state) => ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.visibleSales.length,
          itemBuilder: (context, index) {
            final s = state.visibleSales[index];
            return Card(
              color: const Color(0xFF171A21),
              child: ListTile(
                title: Text(s.platform, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('Net: ${s.finalNet} ${s.currency}'),
              ),
            );
          },
        ),
      ),
    );
  }
}