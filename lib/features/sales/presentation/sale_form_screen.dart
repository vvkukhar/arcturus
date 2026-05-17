import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SaleFormScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic>? sale;
  const SaleFormScreen({super.key, this.sale});

  @override
  ConsumerState<SaleFormScreen> createState() => _SaleFormScreenState();
}

class _SaleFormScreenState extends ConsumerState<SaleFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _inventoryItemId, _platform, _price, _fee, _shippingMe;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final s = widget.sale;
    _inventoryItemId = TextEditingController(text: s?['inventoryItemId']?.toString() ?? '');
    _platform = TextEditingController(text: s?['channel']?.toString() ?? '');
    _price = TextEditingController(text: s?['sellPrice']?.toString() ?? '');
    _fee = TextEditingController(text: s?['platformFee']?.toString() ?? '0');
    _shippingMe = TextEditingController(text: s?['shippingPaidByMe']?.toString() ?? '0');
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    final i18n = ref.read(i18nProvider.notifier);
    
    try {
      final price = double.tryParse(_price.text.replaceAll(',', '.')) ?? 0;
      final fee = double.tryParse(_fee.text.replaceAll(',', '.')) ?? 0;
      final shipMe = double.tryParse(_shippingMe.text.replaceAll(',', '.')) ?? 0;

      final payload = {
        'inventoryItemId': _inventoryItemId.text.trim(),
        'channel': _platform.text.trim(),
        'sellPrice': price,
        'platformFee': fee,
        'shippingPaidByMe': shipMe,
        'quantity': 1,
      };

      await ref.read(salesEngineProvider.notifier).saveSale(payload, id: widget.sale?['id']);
      if (mounted) Navigator.pop(context);
    } catch(e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${i18n.t('snack.saveFailed')} $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(widget.sale == null ? i18n.t('sale.add') : i18n.t('sale.edit'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _platform, 
              decoration: InputDecoration(
                labelText: '${i18n.t('sale.platform')} *',
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ), 
              validator: (v) => v == null || v.trim().isEmpty ? i18n.t('form.required') : null
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _inventoryItemId, 
              decoration: InputDecoration(
                labelText: i18n.t('form.invItemId'),
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ), 
              validator: (v) => v == null || v.trim().isEmpty ? i18n.t('form.required') : null
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildNumField(i18n.t('sale.price'), _price)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField(i18n.t('sale.fee'), _fee)),
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