import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_scanner_modal.dart';

class ItemFormScreen extends ConsumerStatefulWidget {
  final InventoryItemModel? item;
  const ItemFormScreen({super.key, this.item});

  @override
  ConsumerState<ItemFormScreen> createState() => _ItemFormScreenState();
}

class _ItemFormScreenState extends ConsumerState<ItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title, _theme, _setId, _purchasePrice, _shipping, _extra, _expectedPrice, _notes, _location, _sourceUrl, _sourceName;
  
  late ItemType _type;
  late ItemStatus _status;
  late ItemCondition _condition;
  bool _isSealed = false;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final i = widget.item;
    _title = TextEditingController(text: i?.titleSnapshot ?? '');
    _theme = TextEditingController(text: i?.item?.theme ?? '');
    _setId = TextEditingController(text: i?.item?.setNumber ?? '');
    _purchasePrice = TextEditingController(text: i?.purchasePrice.toString() ?? '0');
    _shipping = TextEditingController(text: '0'); // Shipping/Extra merge into cost on backend, keeping UI simple
    _extra = TextEditingController(text: '0');
    _expectedPrice = TextEditingController(text: i?.expectedSalePriceManual?.toString() ?? '');
    _notes = TextEditingController(text: i?.source ?? ''); // Used source for notes in old UI
    
    _location = TextEditingController(text: i?.storageLocationId ?? '');
    _sourceUrl = TextEditingController(text: i?.source ?? ''); 
    _sourceName = TextEditingController(text: i?.source ?? '');

    _type = i?.item?.kind ?? ItemType.set;
    _status = i?.status ?? ItemStatus.purchased;
    _condition = i?.condition ?? ItemCondition.usedGood;
    _isSealed = i?.sealed ?? false;
  }

  @override
  void dispose() {
    _title.dispose(); _theme.dispose(); _setId.dispose(); _purchasePrice.dispose(); 
    _shipping.dispose(); _extra.dispose(); _expectedPrice.dispose(); _notes.dispose();
    _location.dispose(); _sourceUrl.dispose(); _sourceName.dispose();
    super.dispose();
  }

  Future<void> _scanBarcode(I18nNotifier i18n) async {
    final code = await Navigator.push<String>(context, MaterialPageRoute(builder: (_) => const PosScannerModal()));
    if (code != null && code.isNotEmpty) {
      setState(() => _setId.text = code);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(i18n.t('snack.barcodeSuccess', {'code': code})), backgroundColor: Colors.green));
    }
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    final i18n = ref.read(i18nProvider.notifier);
    
    try {
      final pPrice = _parse(_purchasePrice.text);
      final sPrice = _parse(_shipping.text);
      final ePrice = _parse(_extra.text);
      
      final payload = {
        'titleSnapshot': _title.text.trim(),
        'kind': _type.name,
        'theme': _theme.text.trim().isEmpty ? null : _theme.text.trim(),
        'setNumber': _setId.text.trim().isEmpty ? null : _setId.text.trim(),
        'source': _sourceName.text.trim().isEmpty ? null : _sourceName.text.trim(),
        'purchaseUrl': _sourceUrl.text.trim().isEmpty ? null : _sourceUrl.text.trim(),
        'storageLocationId': _location.text.trim().isEmpty ? null : _location.text.trim(),
        'condition': _isSealed ? ItemCondition.newSealed.name : _condition.name,
        'sealed': _isSealed,
        'purchasePrice': pPrice,
        'shippingToMe': sPrice,
        'extraCosts': ePrice,
        'totalCost': pPrice + sPrice + ePrice,
        'expectedSalePriceManual': _expectedPrice.text.trim().isEmpty ? null : _parse(_expectedPrice.text),
        'status': _status.name,
        'quantity': 1,
      };
      
      if (widget.item != null) payload['itemId'] = widget.item!.itemId;

      await ref.read(inventoryEngineProvider.notifier).saveItem(payload, id: widget.item?.id);
      if (mounted) Navigator.of(context).pop();
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
      appBar: AppBar(title: Text(widget.item == null ? i18n.t('form.newItem') : i18n.t('form.editItem'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            children: [
              Text(i18n.t('form.coreDetails'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blueAccent)),
              const SizedBox(height: 12),
              
              DropdownButtonFormField<ItemType>(
                value: _type,
                decoration: InputDecoration(
                  labelText: i18n.t('form.itemType'),
                  filled: true,
                  fillColor: const Color(0xFF171A21),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
                items: ItemType.values.map((type) => DropdownMenuItem(value: type, child: Text(i18n.t('type.${type.name}')))).toList(),
                onChanged: (val) { if (val != null) setState(() => _type = val); },
              ),
              const SizedBox(height: 12),
              TextFormField(controller: _title, decoration: InputDecoration(labelText: i18n.t('form.title')), validator: (v) => v == null || v.trim().isEmpty ? i18n.t('form.required') : null),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _setId, 
                      decoration: InputDecoration(
                        labelText: i18n.t('form.setNumber'),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.qr_code_scanner, color: Colors.blueAccent),
                          onPressed: () => _scanBarcode(i18n),
                          tooltip: i18n.t('form.scanBarcode'),
                        ),
                      )
                    )
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(controller: _theme, decoration: InputDecoration(labelText: i18n.t('form.theme'))),
              const SizedBox(height: 24),

              Text(i18n.t('form.financials'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _buildNumField(i18n.t('form.purchasePrice'), _purchasePrice)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildNumField(i18n.t('form.shipping'), _shipping)),
                ],
              ),
              _buildNumField(i18n.t('form.expectedSale'), _expectedPrice),
              const SizedBox(height: 24),

              Text(i18n.t('form.warehouse'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.orangeAccent)),
              const SizedBox(height: 12),
              
              DropdownButtonFormField<ItemCondition>(
                value: _condition,
                decoration: InputDecoration(
                  labelText: i18n.t('form.condition'),
                  filled: true,
                  fillColor: const Color(0xFF171A21),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
                items: ItemCondition.values.map((cond) => DropdownMenuItem(value: cond, child: Text(i18n.t('cond.${cond.name.replaceAll('ItemCondition.', '')}')))).toList(),
                onChanged: (val) { if (val != null) setState(() => _condition = val); },
              ),
              const SizedBox(height: 12),

              TextFormField(controller: _location, decoration: InputDecoration(labelText: i18n.t('form.location'), prefixIcon: const Icon(Icons.shelves))),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: TextFormField(controller: _sourceName, decoration: InputDecoration(labelText: i18n.t('form.sourceName')))),
                  const SizedBox(width: 12),
                  Expanded(child: TextFormField(controller: _sourceUrl, decoration: InputDecoration(labelText: i18n.t('form.sourceUrl')))),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                child: SwitchListTile(
                  title: Text(i18n.t('form.sealed'), style: const TextStyle(fontWeight: FontWeight.bold)),
                  value: _isSealed,
                  activeColor: Colors.orangeAccent,
                  onChanged: (val) => setState(() => _isSealed = val),
                ),
              ),
              const SizedBox(height: 32),

              FilledButton(
                style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                onPressed: _isSaving ? null : _save,
                child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : Text(i18n.t('form.saveItem'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
              const SizedBox(height: 40),
            ],
          ),
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
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: const Color(0xFF171A21),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        )
      )
    );
  }
}