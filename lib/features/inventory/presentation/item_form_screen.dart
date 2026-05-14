import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
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
  List<String> _imagePaths = [];

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
    _imagePaths = i?.imagePaths.toList() ?? [];
  }

  @override
  void dispose() {
    _title.dispose();
    _theme.dispose();
    _setId.dispose();
    _purchasePrice.dispose();
    _shipping.dispose();
    _extra.dispose();
    _marketAvg.dispose();
    _expectedPrice.dispose();
    _actualPrice.dispose();
    _notes.dispose();
    super.dispose();
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: source, imageQuality: 80);
      
      if (pickedFile != null && mounted) {
        setState(() {
          _imagePaths.add(pickedFile.path);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: $e'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  void _removeImage(int index) {
    setState(() {
      _imagePaths.removeAt(index);
    });
  }

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
      imagePaths: _imagePaths,
    );

    ref.read(inventoryEngineProvider.notifier).saveItem(newItem);
    Navigator.of(context).pop();
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
                    const Text('Photos', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 100,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          _buildImageActionButton(
                            icon: Icons.camera_alt,
                            label: 'Camera',
                            color: Colors.blueAccent,
                            onTap: () => _pickImage(ImageSource.camera),
                          ),
                          const SizedBox(width: 12),
                          _buildImageActionButton(
                            icon: Icons.photo_library,
                            label: 'Gallery',
                            color: Colors.greenAccent,
                            onTap: () => _pickImage(ImageSource.gallery),
                          ),
                          const SizedBox(width: 12),
                          ..._imagePaths.asMap().entries.map((e) {
                            return Stack(
                              children: [
                                Container(
                                  width: 100,
                                  margin: const EdgeInsets.only(right: 12),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.white24),
                                    image: DecorationImage(
                                      image: kIsWeb 
                                          ? NetworkImage(e.value) as ImageProvider 
                                          : FileImage(File(e.value)),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  top: 4,
                                  right: 16,
                                  child: GestureDetector(
                                    onTap: () => _removeImage(e.key),
                                    child: Container(
                                      padding: const EdgeInsets.all(4),
                                      decoration: const BoxDecoration(color: Colors.black87, shape: BoxShape.circle),
                                      child: const Icon(Icons.close, size: 16, color: Colors.white),
                                    ),
                                  ),
                                ),
                              ],
                            );
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    TextFormField(
                      controller: _title, 
                      decoration: const InputDecoration(labelText: 'Title *'), 
                      validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(child: _buildDropdown<ItemType>('Type', _type, ItemType.values, (v) => setState(() => _type = v!))),
                        const SizedBox(width: 16),
                        Expanded(child: _buildDropdown<ItemStatus>('Status', _status, ItemStatus.values, (v) => setState(() => _status = v!))),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: TextFormField(controller: _theme, decoration: const InputDecoration(labelText: 'Theme'))),
                        const SizedBox(width: 16),
                        Expanded(child: TextFormField(controller: _setId, decoration: const InputDecoration(labelText: 'Set ID'))),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 24),
                      child: Divider(height: 1, color: Colors.white10),
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildNumField('Purchase Price', _purchasePrice)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildNumField('Shipping', _shipping)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildNumField('Extra', _extra)),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildNumField('Market Avg', _marketAvg)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildNumField('Expected Sale', _expectedPrice)),
                      ],
                    ),
                    if (_status == ItemStatus.sold) _buildNumField('Actual Sale Price', _actualPrice),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _notes, 
                      maxLines: 4, 
                      decoration: const InputDecoration(labelText: 'Notes', alignLabelWithHint: true)
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    minimumSize: const Size.fromHeight(54), 
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))
                  ),
                  onPressed: _save,
                  child: const Text('Save Item', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImageActionButton({required IconData icon, required String label, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.3), style: BorderStyle.solid),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(label, style: TextStyle(fontSize: 13, color: color, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildNumField(String label, TextEditingController c) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: c, 
        keyboardType: const TextInputType.numberWithOptions(decimal: true), 
        decoration: InputDecoration(labelText: label)
      ),
    );
  }

  Widget _buildDropdown<T>(String label, T val, List<T> values, void Function(T?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: DropdownButtonFormField<T>(
        value: val,
        decoration: InputDecoration(labelText: label),
        items: values.map((e) => DropdownMenuItem(value: e, child: Text(e.toString().split('.').last))).toList(),
        onChanged: onChanged,
      ),
    );
  }
}