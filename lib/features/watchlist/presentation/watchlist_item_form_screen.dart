import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_engine.dart';

class WatchlistItemFormScreen extends ConsumerStatefulWidget {
  final WatchlistItemModel? item;
  const WatchlistItemFormScreen({super.key, this.item});

  @override
  ConsumerState<WatchlistItemFormScreen> createState() => _WatchlistItemFormScreenState();
}

class _WatchlistItemFormScreenState extends ConsumerState<WatchlistItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _title, _desired, _maxBuy;
  bool _isActive = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final i = widget.item;
    _title = TextEditingController(text: i?.title ?? '');
    _desired = TextEditingController(text: i?.desiredBuyPrice.toString() ?? '');
    _maxBuy = TextEditingController(text: i?.maxBuyPrice.toString() ?? '');
    _isActive = i?.isActive ?? true;
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final newItem = WatchlistItemModel(
        id: widget.item?.id ?? DateTime.now().microsecondsSinceEpoch.toString(),
        title: _title.text.trim(),
        type: ItemType.set,
        desiredBuyPrice: _parse(_desired.text),
        maxBuyPrice: _parse(_maxBuy.text),
        isActive: _isActive,
        createdAt: widget.item?.createdAt ?? DateTime.now(),
      );

      await ref.read(watchlistEngineProvider.notifier).saveItem(newItem);
      if (mounted) Navigator.of(context).pop();
    } catch(e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Save failed: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.item == null ? 'Add Watchlist Target' : 'Edit Target', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _desired, decoration: const InputDecoration(labelText: 'Target Buy Price'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _maxBuy, decoration: const InputDecoration(labelText: 'Max Acceptable'), keyboardType: const TextInputType.numberWithOptions(decimal: true))),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _isSaving ? null : _save,
              child: _isSaving ? const CircularProgressIndicator(color: Colors.white) : const Text('Save Target', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}