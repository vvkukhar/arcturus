import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_engine.dart';

class PurchaseFormScreen extends ConsumerStatefulWidget {
  final PurchaseModel? purchase;
  const PurchaseFormScreen({super.key, this.purchase});

  @override
  ConsumerState<PurchaseFormScreen> createState() => _PurchaseFormScreenState();
}

class _PurchaseFormScreenState extends ConsumerState<PurchaseFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _itemId, _source, _price, _shipping, _extra;
  PurchasePaymentMethod _paymentMethod = PurchasePaymentMethod.card;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final p = widget.purchase;
    _itemId = TextEditingController(text: p?.itemId ?? '');
    _source = TextEditingController(text: p?.source ?? '');
    _price = TextEditingController(text: p?.purchasePrice.toString() ?? '');
    _shipping = TextEditingController(text: p?.shippingCost.toString() ?? '0');
    _extra = TextEditingController(text: p?.additionalCosts.toString() ?? '0');
    if (p != null) _paymentMethod = p.paymentMethod;
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    
    try {
      final price = double.tryParse(_price.text.replaceAll(',', '.')) ?? 0;
      final ship = double.tryParse(_shipping.text.replaceAll(',', '.')) ?? 0;
      final extra = double.tryParse(_extra.text.replaceAll(',', '.')) ?? 0;

      final newPurchase = PurchaseModel(
        id: widget.purchase?.id ?? AppUtils.generateId(),
        itemId: _itemId.text.trim(),
        source: _source.text.trim(),
        purchasePrice: price,
        shippingCost: ship,
        additionalCosts: extra,
        finalTotal: price + ship + extra,
        exchangeRate: 1.0,
        currency: 'UAH',
        paymentMethod: _paymentMethod,
        purchaseDate: widget.purchase?.purchaseDate ?? DateTime.now(),
        quantity: 1,
        soldQuantity: 0,
      );

      await ref.read(purchasesEngineProvider.notifier).savePurchase(newPurchase);
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Save failed: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.purchase == null ? 'Add Purchase' : 'Edit Purchase', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(controller: _source, decoration: const InputDecoration(labelText: 'Source (e.g. OLX) *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            TextFormField(controller: _itemId, decoration: const InputDecoration(labelText: 'Item ID / Title (Optional)')),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _price, decoration: const InputDecoration(labelText: 'Price'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _shipping, decoration: const InputDecoration(labelText: 'Shipping'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _isSaving ? null : _save,
              child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : const Text('Save Purchase', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}