import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/sales/application/sales_engine.dart';

class SaleFormScreen extends ConsumerStatefulWidget {
  final SaleModel? sale;
  const SaleFormScreen({super.key, this.sale});

  @override
  ConsumerState<SaleFormScreen> createState() => _SaleFormScreenState();
}

class _SaleFormScreenState extends ConsumerState<SaleFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _itemId, _platform, _price, _fee, _shippingMe, _shippingBuyer;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final s = widget.sale;
    _itemId = TextEditingController(text: s?.itemId ?? '');
    _platform = TextEditingController(text: s?.platform ?? '');
    _price = TextEditingController(text: s?.salePrice.toString() ?? '');
    _fee = TextEditingController(text: s?.platformFee.toString() ?? '0');
    _shippingMe = TextEditingController(text: s?.shippingPaidByMe.toString() ?? '0');
    _shippingBuyer = TextEditingController(text: s?.shippingPaidByBuyer.toString() ?? '0');
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    
    try {
      final price = double.tryParse(_price.text.replaceAll(',', '.')) ?? 0;
      final fee = double.tryParse(_fee.text.replaceAll(',', '.')) ?? 0;
      final shipMe = double.tryParse(_shippingMe.text.replaceAll(',', '.')) ?? 0;
      final shipBuyer = double.tryParse(_shippingBuyer.text.replaceAll(',', '.')) ?? 0;

      final newSale = SaleModel(
        id: widget.sale?.id ?? AppUtils.generateId(),
        itemId: _itemId.text.trim(),
        platform: _platform.text.trim(),
        salePrice: price,
        platformFee: fee,
        shippingPaidByMe: shipMe,
        shippingPaidByBuyer: shipBuyer,
        finalNet: price - fee - shipMe,
        currency: 'UAH',
        saleDate: widget.sale?.saleDate ?? DateTime.now(),
        quantity: 1,
      );

      await ref.read(salesEngineProvider.notifier).saveSale(newSale);
      if (mounted) Navigator.pop(context);
    } catch(e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Save failed: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.sale == null ? 'Add Sale' : 'Edit Sale', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(controller: _platform, decoration: const InputDecoration(labelText: 'Platform (e.g. OLX) *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            // ФІКС: Тепер це поле обов'язкове, сюди треба вставити ID товару з інвентарю
            TextFormField(controller: _itemId, decoration: const InputDecoration(labelText: 'Inventory Item ID *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _price, decoration: const InputDecoration(labelText: 'Sale Price'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _fee, decoration: const InputDecoration(labelText: 'Platform Fee'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _isSaving ? null : _save,
              child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : const Text('Save Sale', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}