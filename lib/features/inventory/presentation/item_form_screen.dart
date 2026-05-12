import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';

class ItemFormScreen extends ConsumerStatefulWidget {
  final ItemModel? item;
  const ItemFormScreen({super.key, this.item});

  @override
  ConsumerState<ItemFormScreen> createState() => _ItemFormScreenState();
}

class _ItemFormScreenState extends ConsumerState<ItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title, _theme, _setId, _purchasePrice, _shipping, _extra, _marketAvg, _expectedPrice, _actualPrice;
  late ItemType _type;
  late ItemStatus _status;

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
    _type = i?.type ?? ItemType.set;
    _status = i?.status ?? ItemStatus.purchased;
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    
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
    );

    ref.read(inventoryEngineProvider.notifier).saveItem(newItem);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.item == null ? 'Add Item' : 'Edit Item', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildDropdown<ItemType>('Type', _type, ItemType.values, (v) => setState(() => _type = v!))),
                const SizedBox(width: 12),
                Expanded(child: _buildDropdown<ItemStatus>('Status', _status, ItemStatus.values, (v) => setState(() => _status = v!))),
              ],
            ),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _theme, decoration: const InputDecoration(labelText: 'Theme'))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _setId, decoration: const InputDecoration(labelText: 'Set ID'))),
              ],
            ),
            const Divider(height: 32, color: Colors.white10),
            Row(
              children: [
                Expanded(child: _buildNumField('Purchase Price', _purchasePrice)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField('Shipping', _shipping)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField('Extra', _extra)),
              ],
            ),
            Row(
              children: [
                Expanded(child: _buildNumField('Market Avg', _marketAvg)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField('Expected Sale', _expectedPrice)),
              ],
            ),
            if (_status == ItemStatus.sold) _buildNumField('Actual Sale Price', _actualPrice),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _save,
              child: const Text('Save Item', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNumField(String label, TextEditingController c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(controller: c, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: label)),
    );
  }

  Widget _buildDropdown<T>(String label, T val, List<T> values, void Function(T?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<T>(
        value: val,
        decoration: InputDecoration(labelText: label),
        items: values.map((e) => DropdownMenuItem(value: e, child: Text(e.toString().split('.').last))).toList(),
        onChanged: onChanged,
      ),
    );
  }
}