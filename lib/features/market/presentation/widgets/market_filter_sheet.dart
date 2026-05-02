import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';

class MarketFilterSheet extends StatefulWidget {
  final MarketFilterModel initialFilter;

  const MarketFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<MarketFilterSheet> createState() => _MarketFilterSheetState();
}

class _MarketFilterSheetState extends State<MarketFilterSheet> {
  late MarketFilterModel _filter;
  late final TextEditingController _sourceController;
  late final TextEditingController _itemController;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _sourceController =
        TextEditingController(text: widget.initialFilter.sourceContains ?? '');
    _itemController = TextEditingController(
      text: widget.initialFilter.itemTitleContains ?? '',
    );
  }

  @override
  void dispose() {
    _sourceController.dispose();
    _itemController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      _filter.copyWith(
        sourceContains: _sourceController.text.trim().isEmpty
            ? null
            : _sourceController.text.trim(),
        itemTitleContains: _itemController.text.trim().isEmpty
            ? null
            : _itemController.text.trim(),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(MarketFilterModel.empty);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
        ),
        child: ListView(
          shrinkWrap: true,
          children: [
            const Text(
              'Market Filters',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _sourceController,
              decoration: const InputDecoration(
                labelText: 'Source contains',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _itemController,
              decoration: const InputDecoration(
                labelText: 'Item title contains',
              ),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('With URL only'),
              value: _filter.withUrlOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(withUrlOnly: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Positive trend only'),
              subtitle: const Text('Show items where latest average is above previous average'),
              value: _filter.positiveTrendOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(positiveTrendOnly: value);
                });
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _clear,
                    child: const Text('Clear'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _apply,
                    child: const Text('Apply'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}