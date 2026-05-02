import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_form_defaults_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_total_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_validation_provider.dart';

class AddPurchaseScreen extends ConsumerStatefulWidget {
  const AddPurchaseScreen({super.key});

  @override
  ConsumerState<AddPurchaseScreen> createState() => _AddPurchaseScreenState();
}

class _AddPurchaseScreenState extends ConsumerState<AddPurchaseScreen> {
  final _formKey = GlobalKey<FormState>();

  final _itemIdController = TextEditingController();
  final _sourceController = TextEditingController();
  final _sourceUrlController = TextEditingController();
  final _sellerNameController = TextEditingController();
  final _sellerContactController = TextEditingController();
  final _purchasePriceController = TextEditingController(text: '0');
  final _shippingController = TextEditingController(text: '0');
  final _additionalCostsController = TextEditingController(text: '0');
  final _quantityController = TextEditingController(text: '1');
  late final TextEditingController _currencyController;
  late final TextEditingController _exchangeRateController;
  final _noteController = TextEditingController();

  late PurchasePaymentMethod _paymentMethod;
  late DateTime _purchaseDate;

  @override
  void initState() {
    super.initState();

    final defaults = ref.read(purchaseFormDefaultsProvider);

    _currencyController = TextEditingController(
      text: defaults.defaultCurrency(),
    );
    _exchangeRateController = TextEditingController(
      text: defaults.defaultExchangeRate().toString(),
    );

    _paymentMethod = defaults.defaultPaymentMethod();
    _purchaseDate = defaults.defaultPurchaseDate();
  }

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  int _parseInt(String value) {
    final parsed = int.tryParse(value.trim()) ?? 1;
    return parsed <= 0 ? 1 : parsed;
  }

  double get _finalTotal {
    return ref.read(purchaseTotalProvider).calculate(
          purchasePrice: _parseDouble(_purchasePriceController.text),
          shippingCost: _parseDouble(_shippingController.text),
          additionalCosts: _parseDouble(_additionalCostsController.text),
        );
  }

  double get _unitCost {
    final quantity = _parseInt(_quantityController.text);
    if (quantity <= 0) return _finalTotal;
    return _finalTotal / quantity;
  }

  Future<void> _pickDate() async {
    final result = await showDatePicker(
      context: context,
      initialDate: _purchaseDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (result == null) return;

    setState(() {
      _purchaseDate = result;
    });
  }

  String? _validateQuantity(String? value) {
    final parsed = int.tryParse((value ?? '').trim());

    if (parsed == null) {
      return 'Quantity must be a number';
    }

    if (parsed <= 0) {
      return 'Quantity must be greater than zero';
    }

    return null;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final purchase = PurchaseModel(
      id: IdGenerator.next(),
      itemId: _itemIdController.text.trim(),
      source: _sourceController.text.trim(),
      sourceUrl: _sourceUrlController.text.trim().isEmpty
          ? null
          : _sourceUrlController.text.trim(),
      sellerName: _sellerNameController.text.trim().isEmpty
          ? null
          : _sellerNameController.text.trim(),
      sellerContact: _sellerContactController.text.trim().isEmpty
          ? null
          : _sellerContactController.text.trim(),
      purchasePrice: _parseDouble(_purchasePriceController.text),
      shippingCost: _parseDouble(_shippingController.text),
      additionalCosts: _parseDouble(_additionalCostsController.text),
      finalTotal: _finalTotal,
      currency: _currencyController.text.trim().toUpperCase(),
      exchangeRate: _parseDouble(_exchangeRateController.text),
      paymentMethod: _paymentMethod,
      purchaseDate: _purchaseDate,
      note: _noteController.text.trim().isEmpty
          ? null
          : _noteController.text.trim(),
      quantity: _parseInt(_quantityController.text),
      soldQuantity: 0,
    );

    Navigator.of(context).pop(purchase);
  }

  @override
  void dispose() {
    _itemIdController.dispose();
    _sourceController.dispose();
    _sourceUrlController.dispose();
    _sellerNameController.dispose();
    _sellerContactController.dispose();
    _purchasePriceController.dispose();
    _shippingController.dispose();
    _additionalCostsController.dispose();
    _quantityController.dispose();
    _currencyController.dispose();
    _exchangeRateController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final validation = ref.watch(purchaseValidationProvider);
    final dateText = _purchaseDate.toIso8601String().split('T').first;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Purchase'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _itemIdController,
              decoration: const InputDecoration(labelText: 'Item ID *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', 'Item ID'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sourceController,
              decoration: const InputDecoration(labelText: 'Source *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', 'Source'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sourceUrlController,
              decoration: const InputDecoration(labelText: 'Source URL'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sellerNameController,
              decoration: const InputDecoration(labelText: 'Seller Name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sellerContactController,
              decoration: const InputDecoration(labelText: 'Seller Contact'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _purchasePriceController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Purchase Price'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Purchase price',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Shipping Cost'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Shipping cost',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _additionalCostsController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Additional Costs'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Additional costs',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Quantity'),
              validator: _validateQuantity,
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Column(
                children: [
                  ListTile(
                    title: const Text('Final Total'),
                    trailing: Text(
                      _finalTotal.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Unit Cost'),
                    trailing: Text(
                      _unitCost.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _currencyController,
              decoration: const InputDecoration(labelText: 'Currency'),
              textCapitalization: TextCapitalization.characters,
              validator: (value) => validation.validateCurrency(value ?? ''),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _exchangeRateController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Exchange Rate'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Exchange rate',
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<PurchasePaymentMethod>(
              value: _paymentMethod,
              decoration: const InputDecoration(labelText: 'Payment Method'),
              items: PurchasePaymentMethod.values
                  .map(
                    (method) => DropdownMenuItem(
                      value: method,
                      child: Text(method.name),
                    ),
                  )
                  .toList(),
              onChanged: (value) {
                if (value == null) return;
                setState(() {
                  _paymentMethod = value;
                });
              },
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                title: const Text('Purchase Date'),
                subtitle: Text(dateText),
                trailing: const Icon(Icons.calendar_month_outlined),
                onTap: _pickDate,
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _noteController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Note'),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _save,
              child: const Text('Save Purchase'),
            ),
          ],
        ),
      ),
    );
  }
}