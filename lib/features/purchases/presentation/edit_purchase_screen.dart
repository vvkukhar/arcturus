import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchase_effective_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_total_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_validation_provider.dart';

class EditPurchaseScreen extends ConsumerStatefulWidget {
  final PurchaseModel purchase;

  const EditPurchaseScreen({
    super.key,
    required this.purchase,
  });

  @override
  ConsumerState<EditPurchaseScreen> createState() => _EditPurchaseScreenState();
}

class _EditPurchaseScreenState extends ConsumerState<EditPurchaseScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _itemIdController;
  late final TextEditingController _sourceController;
  late final TextEditingController _sourceUrlController;
  late final TextEditingController _sellerNameController;
  late final TextEditingController _sellerContactController;
  late final TextEditingController _purchasePriceController;
  late final TextEditingController _shippingController;
  late final TextEditingController _additionalCostsController;
  late final TextEditingController _quantityController;
  late final TextEditingController _currencyController;
  late final TextEditingController _exchangeRateController;
  late final TextEditingController _noteController;

  late PurchasePaymentMethod _paymentMethod;
  late DateTime _purchaseDate;

  @override
  void initState() {
    super.initState();

    final purchase = widget.purchase;

    _itemIdController = TextEditingController(text: purchase.itemId);
    _sourceController = TextEditingController(text: purchase.source);
    _sourceUrlController = TextEditingController(text: purchase.sourceUrl ?? '');
    _sellerNameController =
        TextEditingController(text: purchase.sellerName ?? '');
    _sellerContactController =
        TextEditingController(text: purchase.sellerContact ?? '');
    _purchasePriceController =
        TextEditingController(text: purchase.purchasePrice.toString());
    _shippingController =
        TextEditingController(text: purchase.shippingCost.toString());
    _additionalCostsController =
        TextEditingController(text: purchase.additionalCosts.toString());
    _quantityController =
        TextEditingController(text: purchase.quantity.toString());
    _currencyController = TextEditingController(text: purchase.currency);
    _exchangeRateController =
        TextEditingController(text: purchase.exchangeRate.toString());
    _noteController = TextEditingController(text: purchase.note ?? '');

    _paymentMethod = purchase.paymentMethod;
    _purchaseDate = purchase.purchaseDate;
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

  int get _effectiveSoldQuantity {
    final effective = ref.watch(
      purchaseEffectiveStockProvider(widget.purchase.id),
    );

    return effective?.soldQuantity ?? widget.purchase.soldQuantity;
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

  String? _validateQuantity(String? value, I18nNotifier i18n) {
    final parsed = int.tryParse((value ?? '').trim());

    if (parsed == null) {
      return i18n.t('common.error', {'error': 'Must be a number'});
    }

    if (parsed <= 0) {
      return i18n.t('common.error', {'error': 'Must be > 0'});
    }

    if (parsed < _effectiveSoldQuantity) {
      return i18n.t('common.error', {'error': 'Cannot be lower than sold'});
    }

    return null;
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final updated = widget.purchase.copyWith(
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

    Navigator.of(context).pop(updated);
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
    final i18n = ref.watch(i18nProvider.notifier);
    final dateText = _purchaseDate.toIso8601String().split('T').first;
    final effectiveSoldQuantity = _effectiveSoldQuantity;

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('pur.edit')),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _itemIdController,
              decoration: InputDecoration(labelText: '${i18n.t('Item ID')} *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', i18n.t('Item ID')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sourceController,
              decoration: InputDecoration(labelText: '${i18n.t('pur.source')} *'),
              validator: (value) =>
                  validation.validateRequiredText(value ?? '', i18n.t('pur.source')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sourceUrlController,
              decoration: InputDecoration(labelText: i18n.t('pur.sourceUrl')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sellerNameController,
              decoration: InputDecoration(labelText: i18n.t('pur.seller')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _sellerContactController,
              decoration: InputDecoration(labelText: i18n.t('pur.contact')),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _purchasePriceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.price')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('pur.price'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _shippingController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.shipping')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('pur.shipping'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _additionalCostsController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.extra')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('pur.extra'),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: i18n.t('inv.qty'),
                helperText: '${i18n.t('Allocated/sold:')} $effectiveSoldQuantity',
              ),
              validator: (val) => _validateQuantity(val, i18n),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            Card(
              child: Column(
                children: [
                  ListTile(
                    title: Text(i18n.t('inv.totalCost')),
                    trailing: Text(
                      _finalTotal.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: Text(i18n.t('Unit Cost')),
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
              decoration: InputDecoration(labelText: i18n.t('pur.currency')),
              textCapitalization: TextCapitalization.characters,
              validator: (value) => validation.validateCurrency(value ?? ''),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _exchangeRateController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: i18n.t('pur.exchange')),
              validator: (value) => validation.validatePositiveOrZero(
                value ?? '',
                i18n.t('pur.exchange'),
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<PurchasePaymentMethod>(
              value: _paymentMethod,
              decoration: InputDecoration(labelText: i18n.t('pur.payment')),
              items: PurchasePaymentMethod.values
                  .map(
                    (method) => DropdownMenuItem(
                      value: method,
                      child: Text(i18n.t(method.name)),
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
                title: Text(i18n.t('pur.date')),
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
              child: Text(i18n.t('common.saveChanges')),
            ),
          ],
        ),
      ),
    );
  }
}