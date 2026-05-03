import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_validation_provider.dart';

class EditSaleScreen extends ConsumerStatefulWidget {
  final SaleModel sale;

  const EditSaleScreen({
    super.key,
    required this.sale,
  });

  @override
  ConsumerState<EditSaleScreen> createState() => _EditSaleScreenState();
}

class _EditSaleScreenState extends ConsumerState<EditSaleScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _itemIdController;
  late final TextEditingController _platformController;
  late final TextEditingController _buyerNameController;
  late final TextEditingController _salePriceController;
  late final TextEditingController _platformFeeController;
  late final TextEditingController _shippingPaidByMeController;
  late final TextEditingController _quantityController;
  late final TextEditingController _currencyController;
  late final TextEditingController _noteController;

  late DateTime _saleDate;

  @override
  void initState() {
    super.initState();

    final sale = widget.sale;

    _itemIdController = TextEditingController(text: sale.itemId);
    _platformController = TextEditingController(text: sale.platform);
    _buyerNameController = TextEditingController(text: sale.buyerName ?? '');
    _salePriceController = TextEditingController(
      text: sale.salePrice.toString(),
    );
    _platformFeeController = TextEditingController(
      text: sale.platformFee.toString(),
    );
    _shippingPaidByMeController = TextEditingController(
      text: sale.shippingPaidByMe.toString(),
    );
    _quantityController = TextEditingController(text: sale.quantity.toString());
    _currencyController = TextEditingController(text: sale.currency);
    _noteController = TextEditingController(text: sale.note ?? '');

    _saleDate = sale.saleDate;
  }

  double _parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  int _parseInt(String value) {
    final parsed = int.tryParse(value.trim()) ?? 1;
    return parsed <= 0 ? 1 : parsed;
  }

  double get _finalNet {
    return ref.read(saleNetProvider).calculate(
          salePrice: _parseDouble(_salePriceController.text),
          platformFee: _parseDouble(_platformFeeController.text),
          shippingByMe: _parseDouble(_shippingPaidByMeController.text),
        );
  }

  double get _unitNet {
    final quantity = _parseInt(_quantityController.text);
    if (quantity <= 0) return _finalNet;
    return _finalNet / quantity;
  }

  Future<void> _pickDate() async {
    final result = await showDatePicker(
      context: context,
      initialDate: _saleDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (result == null) return;

    setState(() {
      _saleDate = result;
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

    final updated = widget.sale.copyWith(
      itemId: _itemIdController.text.trim(),
      platform: _platformController.text.trim(),
      buyerName: _buyerNameController.text.trim().isEmpty
          ? null
          : _buyerNameController.text.trim(),
      salePrice: _parseDouble(_salePriceController.text),
      platformFee: _parseDouble(_platformFeeController.text),
      shippingPaidByMe: _parseDouble(_shippingPaidByMeController.text),
      finalNet: _finalNet,
      currency: _currencyController.text.trim().toUpperCase(),
      saleDate: _saleDate,
      note: _noteController.text.trim().isEmpty
          ? null
          : _noteController.text.trim(),
      quantity: _parseInt(_quantityController.text),
    );

    Navigator.of(context).pop(updated);
  }

  @override
  void dispose() {
    _itemIdController.dispose();
    _platformController.dispose();
    _buyerNameController.dispose();
    _salePriceController.dispose();
    _platformFeeController.dispose();
    _shippingPaidByMeController.dispose();
    _quantityController.dispose();
    _currencyController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final validation = ref.watch(saleValidationProvider);
    final dateText = _saleDate.toIso8601String().split('T').first;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Sale'),
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
              controller: _platformController,
              decoration: const InputDecoration(labelText: 'Platform *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', 'Platform'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _buyerNameController,
              decoration: const InputDecoration(labelText: 'Buyer Name'),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _salePriceController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Sale Price'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Sale price',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _platformFeeController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Platform Fee'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Platform fee',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingPaidByMeController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Shipping By Me'),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                'Shipping by me',
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
                    title: const Text('Final Net'),
                    trailing: Text(
                      _finalNet.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Unit Net'),
                    trailing: Text(
                      _unitNet.toStringAsFixed(2),
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
            Card(
              child: ListTile(
                title: const Text('Sale Date'),
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
              child: const Text('Save Changes'),
            ),
          ],
        ),
      ),
    );
  }
}