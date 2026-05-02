import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_code_list.dart';
import 'package:lego_trading_manager/features/settings/application/currency_converter_controller.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/currency_code_dropdown.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/currency_converter_result_card.dart';

class CurrencyConverterScreen extends ConsumerStatefulWidget {
  const CurrencyConverterScreen({super.key});

  @override
  ConsumerState<CurrencyConverterScreen> createState() =>
      _CurrencyConverterScreenState();
}

class _CurrencyConverterScreenState
    extends ConsumerState<CurrencyConverterScreen> {
  final _amountController = TextEditingController(text: '0');
  final _rateController = TextEditingController(text: '1');

  double _parse(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  @override
  void dispose() {
    _amountController.dispose();
    _rateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(currencyConverterControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency Converter'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          CurrencyCodeDropdown(
            value: state.fromCurrency,
            items: CurrencyCodeList.common,
            label: 'From',
            onChanged: (value) {
              if (value == null) return;
              ref
                  .read(currencyConverterControllerProvider.notifier)
                  .setFromCurrency(value);
            },
          ),
          const SizedBox(height: 12),
          CurrencyCodeDropdown(
            value: state.toCurrency,
            items: CurrencyCodeList.common,
            label: 'To',
            onChanged: (value) {
              if (value == null) return;
              ref
                  .read(currencyConverterControllerProvider.notifier)
                  .setToCurrency(value);
            },
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Amount'),
            onChanged: (value) {
              ref
                  .read(currencyConverterControllerProvider.notifier)
                  .setInputAmount(_parse(value));
            },
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _rateController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Rate'),
            onChanged: (value) {
              ref
                  .read(currencyConverterControllerProvider.notifier)
                  .setRate(_parse(value));
            },
          ),
          const SizedBox(height: 16),
          CurrencyConverterResultCard(
            fromCurrency: state.fromCurrency,
            toCurrency: state.toCurrency,
            inputAmount: state.inputAmount,
            rate: state.rate,
            outputAmount: state.outputAmount,
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () async {
              final messenger = ScaffoldMessenger.of(context);

              await ref
                  .read(currencyConverterControllerProvider.notifier)
                  .saveToHistory();

              if (!mounted) return;
              messenger.showSnackBar(
                const SnackBar(content: Text('Conversion saved')),
              );
            },
            child: const Text('Save Conversion'),
          ),
        ],
      ),
    );
  }
}