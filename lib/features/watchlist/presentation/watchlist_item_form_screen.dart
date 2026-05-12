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
  late final TextEditingController _title, _theme, _refId, _desired, _maxBuy, _market, _comment;
  late bool _isActive;
  late ItemType _itemType;

  @override
  void initState() {
    super.initState();
    final i = widget.item;
    _title = TextEditingController(text: i?.title ?? '');
    _theme = TextEditingController(text: i?.theme ?? '');
    _refId = TextEditingController(text: i?.refId ?? '');
    _desired = TextEditingController(text: i?.desiredBuyPrice.toString() ?? '');
    _maxBuy = TextEditingController(text: i?.maxBuyPrice.toString() ?? '');
    _market = TextEditingController(text: i?.marketPrice?.toString() ?? '');
    _comment = TextEditingController(text: i?.comment ?? '');
    _isActive = i?.isActive ?? true;
    _itemType = i?.type ?? ItemType.set;
  }

  double _parse(String val) => double.tryParse(val.replaceAll(',', '.')) ?? 0;

  void _save() {
    if (!_formKey.currentState!.validate()) return;

    final newItem = WatchlistItemModel(
      id: widget.item?.id ?? DateTime.now().microsecondsSinceEpoch.toString(),
      title: _title.text.trim(),
      type: _itemType,
      theme: _theme.text.trim().isEmpty ? null : _theme.text.trim(),
      refId: _refId.text.trim().isEmpty ? null : _refId.text.trim(),
      desiredBuyPrice: _parse(_desired.text),
      maxBuyPrice: _parse(_maxBuy.text),
      marketPrice: _market.text.trim().isEmpty ? null : _parse(_market.text),
      comment: _comment.text.trim().isEmpty ? null : _comment.text.trim(),
      isActive: _isActive,
      createdAt: widget.item?.createdAt ?? DateTime.now(),
    );

    ref.read(watchlistEngineProvider.notifier).saveItem(newItem);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.item == null ? 'Add Watchlist Target' : 'Edit Target', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: Form(
        key: _formKey,
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            SwitchListTile(
              title: const Text('Active Tracking', style: TextStyle(fontWeight: FontWeight.bold)),
              value: _isActive,
              onChanged: (v) => setState(() => _isActive = v),
              activeColor: Colors.blueAccent,
            ),
            const SizedBox(height: 12),
            TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextFormField(controller: _theme, decoration: const InputDecoration(labelText: 'Theme'))),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(controller: _refId, decoration: const InputDecoration(labelText: 'Set ID / Ref'))),
              ],
            ),
            const Divider(height: 32, color: Colors.white10),
            Row(
              children: [
                Expanded(child: _buildNumField('Target Buy Price', _desired)),
                const SizedBox(width: 12),
                Expanded(child: _buildNumField('Max Acceptable', _maxBuy)),
              ],
            ),
            _buildNumField('Current Market Price (Est.)', _market),
            const SizedBox(height: 12),
            TextFormField(controller: _comment, maxLines: 3, decoration: const InputDecoration(labelText: 'Notes')),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: _save,
              child: const Text('Save Target', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
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
}