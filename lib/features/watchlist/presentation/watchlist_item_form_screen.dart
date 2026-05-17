import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistItemFormScreen extends ConsumerStatefulWidget {
  final WatchlistItemModel? item;
  const WatchlistItemFormScreen({super.key, this.item});

  @override
  ConsumerState<WatchlistItemFormScreen> createState() => _WatchlistItemFormScreenState();
}

class _WatchlistItemFormScreenState extends ConsumerState<WatchlistItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title, _setNumber, _desired, _maxBuy;
  bool _isActive = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final i = widget.item;
    _title = TextEditingController(text: i?.titleSnapshot ?? '');
    _setNumber = TextEditingController(text: i?.item?.setNumber ?? ''); 
    _desired = TextEditingController(text: i?.desiredBuyPrice.toString() ?? '');
    _maxBuy = TextEditingController(text: i?.maxBuyPrice.toString() ?? '');
    _isActive = i?.active ?? true;
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    final i18n = ref.read(i18nProvider.notifier);

    try {
      final payload = {
        'titleSnapshot': _title.text.trim(),
        'setNumber': _setNumber.text.trim(),
        'desiredBuyPrice': _parse(_desired.text),
        'maxBuyPrice': _parse(_maxBuy.text),
        'active': _isActive,
      };

      if (widget.item != null) payload['itemId'] = widget.item!.itemId;

      await ref.read(watchlistEngineProvider.notifier).saveItem(payload, id: widget.item?.id);
      if (mounted) Navigator.of(context).pop();
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
      appBar: AppBar(title: Text(widget.item == null ? i18n.t('watch.add') : i18n.t('common.edit'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _title, 
              decoration: InputDecoration(
                labelText: i18n.t('form.title'),
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ), 
              validator: (v) => v == null || v.trim().isEmpty ? i18n.t('form.required') : null
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _setNumber, 
              decoration: InputDecoration(
                labelText: '${i18n.t('form.setNumber')} (e.g. 75313) *', // ФІКС ІНТЕРПОЛЯЦІЇ
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ), 
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.trim().isEmpty ? i18n.t('watch.setNumberReq') : null
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _desired, decoration: InputDecoration(labelText: i18n.t('watch.targetBuyPrice'), filled: true, fillColor: const Color(0xFF171A21), border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none)), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _maxBuy, decoration: InputDecoration(labelText: i18n.t('watch.maxAcceptable'), filled: true, fillColor: const Color(0xFF171A21), border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none)), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF171A21),
                borderRadius: BorderRadius.circular(16),
              ),
              child: SwitchListTile(
                title: Text(i18n.t('watch.activeTarget'), style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text(i18n.t('watch.turnOff'), style: const TextStyle(color: Colors.white54, fontSize: 12)),
                value: _isActive,
                activeColor: Colors.blueAccent,
                onChanged: (val) => setState(() => _isActive = val),
              ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _isSaving ? null : _save,
              child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : Text(i18n.t('watch.saveTarget'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}