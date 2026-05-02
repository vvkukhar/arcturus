import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/manual_rates_controller.dart';
import 'package:lego_trading_manager/features/settings/presentation/add_manual_rate_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/manual_rate_card.dart';

class ManualCurrencyRatesScreen extends ConsumerWidget {
  const ManualCurrencyRatesScreen({super.key});

  Future<void> _openAdd(BuildContext context) async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const AddManualRateScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rates = ref.watch(manualRatesControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manual Rates'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openAdd(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Rate'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: rates.isEmpty
            ? const Center(
                child: Text('No manual rates yet.'),
              )
            : ListView.separated(
                itemCount: rates.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  return ManualRateCard(rate: rates[index]);
                },
              ),
      ),
    );
  }
}