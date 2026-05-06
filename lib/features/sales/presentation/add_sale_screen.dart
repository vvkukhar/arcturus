import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_form_defaults_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_validation_provider.dart';

class AddSaleScreen extends ConsumerStatefulWidget {
  const AddSaleScreen({super.key});

  @override
  ConsumerState<AddSaleScreen> createState() => _AddSaleScreenState();
}

class _AddSaleScreenState extends ConsumerState<AddSaleScreen> {
  final _formKey = GlobalKey<FormState>();

  final _itemIdController = TextEditingController();
  late final TextEditingController _platformController;
  final _buyerNameController = TextEditingController();
  final _salePriceController = TextEditingController(text: '0');
  final _platformFeeController = TextEditingController(text: '0');
  final _shippingPaidByMeController = TextEditingController(text: '0');
  final _quantityController = TextEditingController(text: '1');
  late final TextEditingController _currencyController;
  final _noteController = TextEditingController();

  late DateTime _saleDate;

  @override
  void initState() {
    super.initState();

    final defaults = ref.read(saleFormDefaultsProvider);

    _platformController = TextEditingController(
      text: defaults.defaultPlatform(),
    );
    _currencyController = TextEditingController(
      text: defaults.defaultCurrency(),
    );
    _saleDate = defaults.defaultSaleDate();
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

  String? _validateQuantity(String? value, I18nNotifier i18n) {
    final parsed = int.tryParse((value ?? '').trim());
    if (parsed == null) return i18n.t('common.error', {'error': 'Must be a number'});
    if (parsed <= 0) return i18n.t('common.error', {'error': 'Must be > 0'});
    return null;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final sale = SaleModel(
      id: IdGenerator.next(),
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

    Navigator.of(context).pop(sale);
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
    final i18n = ref.watch(i18nProvider.notifier);
    final dateText = _saleDate.toIso8601String().split('T').first;

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('sale.add')),
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
              decoration: InputDecoration(labelText: '${i18n.t('sale.platform')} *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', i18n.t('sale.platform')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _buyerNameController,
              decoration: InputDecoration(labelText: i18n.t('sale.buyer')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _salePriceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('sale.price')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('sale.price'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _platformFeeController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('sale.fee')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('sale.fee'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingPaidByMeController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('sale.shipMe')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('sale.shipMe'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(labelText: i18n.t('inv.qty')),
              validator: (val) => _validateQuantity(val, i18n),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Column(
                children: [
                  ListTile(
                    title: Text(i18n.t('sale.net')),
                    trailing: Text(
                      _finalNet.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: Text(i18n.t('sale.unitNet')),
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
              decoration: InputDecoration(labelText: i18n.t('pur.currency')),
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
              decoration: InputDecoration(labelText: i18n.t('inv.notes')),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: _save,
              child: Text(i18n.t('common.save')),
            ),
          ],
        ),
      ),
    );
  }
}