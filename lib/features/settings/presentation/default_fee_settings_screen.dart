import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class DefaultFeeSettingsScreen extends ConsumerStatefulWidget {
  const DefaultFeeSettingsScreen({super.key});

  @override
  ConsumerState<DefaultFeeSettingsScreen> createState() =>
      _DefaultFeeSettingsScreenState();
}

class _DefaultFeeSettingsScreenState
    extends ConsumerState<DefaultFeeSettingsScreen> {
  late final TextEditingController _saleFeeController;
  late final TextEditingController _shippingMeController;
  late final TextEditingController _shippingBuyerController;
  late final TextEditingController _purchaseShippingController;
  late final TextEditingController _purchaseExtraController;

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  @override
  void initState() {
    super.initState();
    final settings = ref.read(appSettingsControllerProvider);
    _saleFeeController =
        TextEditingController(text: settings.defaultSaleFeePercent.toString());
    _shippingMeController = TextEditingController(
      text: settings.defaultShippingPaidByMe.toString(),
    );
    _shippingBuyerController = TextEditingController(
      text: settings.defaultShippingPaidByBuyer.toString(),
    );
    _purchaseShippingController = TextEditingController(
      text: settings.defaultPurchaseShipping.toString(),
    );
    _purchaseExtraController = TextEditingController(
      text: settings.defaultPurchaseExtraCosts.toString(),
    );
  }

  @override
  void dispose() {
    _saleFeeController.dispose();
    _shippingMeController.dispose();
    _shippingBuyerController.dispose();
    _purchaseShippingController.dispose();
    _purchaseExtraController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    await ref.read(appSettingsControllerProvider.notifier).update(
          defaultSaleFeePercent: _parseDouble(_saleFeeController.text),
          defaultShippingPaidByMe: _parseDouble(_shippingMeController.text),
          defaultShippingPaidByBuyer:
              _parseDouble(_shippingBuyerController.text),
          defaultPurchaseShipping:
              _parseDouble(_purchaseShippingController.text),
          defaultPurchaseExtraCosts:
              _parseDouble(_purchaseExtraController.text),
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Default fees saved')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Default Fees'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _saleFeeController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Default Sale Fee %'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _shippingMeController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration:
                const InputDecoration(labelText: 'Default Shipping Paid By Me'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _shippingBuyerController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              labelText: 'Default Shipping Paid By Buyer',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _purchaseShippingController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration:
                const InputDecoration(labelText: 'Default Purchase Shipping'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _purchaseExtraController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              labelText: 'Default Purchase Extra Costs',
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _save,
            child: const Text('Save Defaults'),
          ),
        ],
      ),
    );
  }
}