import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';
import 'package:lego_trading_manager/features/settings/application/manual_rates_controller.dart';

class AddManualRateScreen extends ConsumerStatefulWidget {
  const AddManualRateScreen({super.key});

  @override
  ConsumerState<AddManualRateScreen> createState() =>
      _AddManualRateScreenState();
}

class _AddManualRateScreenState extends ConsumerState<AddManualRateScreen> {
  final _codeController = TextEditingController();
  final _rateController = TextEditingController(text: '1');

  double _parse(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  @override
  void dispose() {
    _codeController.dispose();
    _rateController.dispose();
    super.dispose();
  }

  void _save() {
    final code = _codeController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    final item = ManualCurrencyRateModel(
      code: code,
      rateToUah: _parse(_rateController.text),
      updatedAt: DateTime.now(),
    );

    ref.read(manualRatesControllerProvider.notifier).add(item);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Manual Rate')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _codeController,
            decoration: const InputDecoration(labelText: 'Currency Code'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _rateController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Rate To UAH'),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _save,
            child: const Text('Save Rate'),
          ),
        ],
      ),
    );
  }
}