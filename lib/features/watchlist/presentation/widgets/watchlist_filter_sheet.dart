import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';

class WatchlistFilterSheet extends StatefulWidget {
  final WatchlistFilterModel initialFilter;

  const WatchlistFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<WatchlistFilterSheet> createState() => _WatchlistFilterSheetState();
}

class _WatchlistFilterSheetState extends State<WatchlistFilterSheet> {
  late WatchlistFilterModel _filter;
  late final TextEditingController _themeController;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _themeController =
        TextEditingController(text: widget.initialFilter.themeContains ?? '');
  }

  @override
  void dispose() {
    _themeController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      _filter.copyWith(
        themeContains: _themeController.text.trim().isEmpty
            ? null
            : _themeController.text.trim(),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(WatchlistFilterModel.empty);
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
              'Watchlist Filters',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _themeController,
              decoration: const InputDecoration(labelText: 'Theme contains'),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Active only'),
              value: _filter.activeOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(activeOnly: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Target hit only'),
              value: _filter.targetHitOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(targetHitOnly: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Under max only'),
              value: _filter.underMaxOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(underMaxOnly: value);
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