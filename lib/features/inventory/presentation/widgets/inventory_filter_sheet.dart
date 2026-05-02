import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';

class InventoryFilterSheet extends StatefulWidget {
  final InventoryFilterModel initialFilter;

  const InventoryFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<InventoryFilterSheet> createState() => _InventoryFilterSheetState();
}

class _InventoryFilterSheetState extends State<InventoryFilterSheet> {
  late InventoryFilterModel _filter;
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
    Navigator.of(context).pop(InventoryFilterModel.empty);
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
              'Inventory Filters',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ItemStatus?>(
              value: _filter.status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: [
                const DropdownMenuItem<ItemStatus?>(
                  value: null,
                  child: Text('All statuses'),
                ),
                ...ItemStatus.values.map(
                  (status) => DropdownMenuItem<ItemStatus?>(
                    value: status,
                    child: Text(status.name),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(
                    status: value,
                    clearStatus: value == null,
                  );
                });
              },
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _themeController,
              decoration: const InputDecoration(
                labelText: 'Theme contains',
              ),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Tracked only'),
              value: _filter.trackedOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(trackedOnly: value);
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