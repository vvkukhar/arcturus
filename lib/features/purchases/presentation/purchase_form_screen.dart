import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

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
    final i18n = ref.read(i18nProvider.notifier);
    
    try {
      final price = double.tryParse(_price.text.replaceAll(',', '.')) ?? 0;
      final ship = double.tryParse(_shipping.text.replaceAll(',', '.')) ?? 0;
      final extra = double.tryParse(_extra.text.replaceAll(',', '.')) ?? 0;

      final payload = {
        'itemId': _itemId.text.trim(),
        'sourceCode': _source.text.trim(),
        'purchasePrice': price,
        'shippingCost': ship,
        'additionalCosts': extra,
        'quantity': 1,
        'paymentMethod': _paymentMethod.name,
      };

      await ref.read(purchasesEngineProvider.notifier).savePurchase(payload, id: widget.purchase?.id);
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(i18n.t('snack.saveFailed', {'error': e.toString()})), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(widget.purchase == null ? i18n.t('pur.add') : i18n.t('pur.edit'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _source, 
              decoration: InputDecoration(
                labelText: i18n.t('pur.source') + ' *',
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ), 
              validator: (v) => v == null || v.trim().isEmpty ? i18n.t('form.required') : null
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _itemId, 
              decoration: InputDecoration(
                labelText: i18n.t('form.itemIdOpt'),
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              )
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildNumField(i18n.t('pur.price'), _price)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField(i18n.t('pur.shipping'), _shipping)),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _isSaving ? null : _save,
              child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : Text(i18n.t('common.save'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNumField(String label, TextEditingController c) {
    return TextFormField(
      controller: c, 
      keyboardType: const TextInputType.numberWithOptions(decimal: true), 
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: const Color(0xFF171A21),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      )
    );
  }
}