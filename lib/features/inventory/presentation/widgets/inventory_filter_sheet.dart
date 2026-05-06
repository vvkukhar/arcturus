import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';

class InventoryFilterSheet extends ConsumerStatefulWidget {
  final InventoryFilterModel initialFilter;

  const InventoryFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  ConsumerState<InventoryFilterSheet> createState() => _InventoryFilterSheetState();
}

class _InventoryFilterSheetState extends ConsumerState<InventoryFilterSheet> {
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
    final i18n = ref.watch(i18nProvider.notifier);

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
            Text(
              i18n.t('Inventory Filters'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ItemStatus?>(
              value: _filter.status,
              decoration: InputDecoration(labelText: i18n.t('Status')),
              items: [
                DropdownMenuItem<ItemStatus?>(
                  value: null,
                  child: Text(i18n.t('All statuses')),
                ),
                ...ItemStatus.values.map(
                  (status) => DropdownMenuItem<ItemStatus?>(
                    value: status,
                    child: Text(i18n.t(status.name)),
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
              decoration: InputDecoration(
                labelText: i18n.t('Theme contains'),
              ),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('Tracked only')),
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
                    child: Text(i18n.t('common.clear')),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _apply,
                    child: Text(i18n.t('common.apply')),
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