import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';

class ItemFormScreen extends ConsumerStatefulWidget {
  final ItemModel? item;
  const ItemFormScreen({super.key, this.item});

  @override
  ConsumerState<ItemFormScreen> createState() => _ItemFormScreenState();
}

class _ItemFormScreenState extends ConsumerState<ItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title, _theme, _setId, _purchasePrice, _shipping, _extra, _marketAvg, _expectedPrice, _actualPrice, _notes;
  late ItemType _type;
  late ItemStatus _status;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final i = widget.item;
    _title = TextEditingController(text: i?.title ?? '');
    _theme = TextEditingController(text: i?.theme ?? '');
    _setId = TextEditingController(text: i?.setId ?? '');
    _purchasePrice = TextEditingController(text: i?.purchasePrice.toString() ?? '0');
    _shipping = TextEditingController(text: i?.shippingToMe.toString() ?? '0');
    _extra = TextEditingController(text: i?.extraCosts.toString() ?? '0');
    _marketAvg = TextEditingController(text: i?.marketAverage?.toString() ?? '');
    _expectedPrice = TextEditingController(text: i?.expectedSalePrice?.toString() ?? '');
    _actualPrice = TextEditingController(text: i?.actualSalePrice?.toString() ?? '');
    _notes = TextEditingController(text: i?.notes ?? '');
    _type = i?.type ?? ItemType.set;
    _status = i?.status ?? ItemStatus.purchased;
  }

  @override
  void dispose() {
    _title.dispose(); _theme.dispose(); _setId.dispose(); _purchasePrice.dispose(); _shipping.dispose(); _extra.dispose(); _marketAvg.dispose(); _expectedPrice.dispose(); _actualPrice.dispose(); _notes.dispose();
    super.dispose();
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    
    try {
      final pPrice = _parse(_purchasePrice.text);
      final sPrice = _parse(_shipping.text);
      final ePrice = _parse(_extra.text);
      final totalCost = pPrice + sPrice + ePrice;

      final newItem = ItemModel(
        id: widget.item?.id ?? DateTime.now().microsecondsSinceEpoch.toString(),
        title: _title.text.trim(),
        type: _type,
        theme: _theme.text.trim().isEmpty ? null : _theme.text.trim(),
        setId: _setId.text.trim().isEmpty ? null : _setId.text.trim(),
        notes: _notes.text.trim().isEmpty ? null : _notes.text.trim(),
        condition: widget.item?.condition ?? ItemCondition.newSealed,
        completeness: widget.item?.completeness ?? ItemCompleteness.complete,
        ownershipType: widget.item?.ownershipType ?? OwnershipType.resale,
        purchasePrice: pPrice,
        shippingToMe: sPrice,
        extraCosts: ePrice,
        totalCost: totalCost,
        marketAverage: _marketAvg.text.trim().isEmpty ? null : _parse(_marketAvg.text),
        expectedSalePrice: _expectedPrice.text.trim().isEmpty ? null : _parse(_expectedPrice.text),
        actualSalePrice: _actualPrice.text.trim().isEmpty ? null : _parse(_actualPrice.text),
        status: _status,
        purchaseDate: widget.item?.purchaseDate ?? DateTime.now(),
        saleDate: _status == ItemStatus.sold ? (widget.item?.saleDate ?? DateTime.now()) : null,
        isTracked: true,
        quantity: 1,
        imagePaths: widget.item?.imagePaths ?? [],
      );

      await ref.read(inventoryEngineProvider.notifier).saveItem(newItem);
      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString().replaceAll('Exception: ', '')), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.item == null ? 'Add Item' : 'Edit Item', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  children: [
                    TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(child: _buildNumField('Purchase Price', _purchasePrice)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildNumField('Shipping', _shipping)),
                      ],
                    ),
                    _buildNumField('Expected Sale', _expectedPrice),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: FilledButton(
                  style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  onPressed: _isSaving ? null : _save,
                  child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : const Text('Save Item', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNumField(String label, TextEditingController c) {
    return Padding(padding: const EdgeInsets.only(bottom: 16), child: TextFormField(controller: c, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: label)));
  }
}