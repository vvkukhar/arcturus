import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/data/models/partout_project_status.dart';
import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';

class PartOutFilterSheet extends ConsumerStatefulWidget {
  final PartOutFilterModel initialFilter;

  const PartOutFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  ConsumerState<PartOutFilterSheet> createState() => _PartOutFilterSheetState();
}

class _PartOutFilterSheetState extends ConsumerState<PartOutFilterSheet> {
  late PartOutFilterModel _filter;
  late final TextEditingController _titleController;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _titleController =
        TextEditingController(text: widget.initialFilter.titleContains ?? '');
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      _filter.copyWith(
        titleContains: _titleController.text.trim().isEmpty
            ? null
            : _titleController.text.trim(),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(PartOutFilterModel.empty);
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
              i18n.t('Part-out Filters'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<PartOutProjectStatus?>(
              value: _filter.status,
              decoration: InputDecoration(labelText: i18n.t('Status')),
              items: [
                DropdownMenuItem<PartOutProjectStatus?>(
                  value: null,
                  child: Text(i18n.t('All')),
                ),
                ...PartOutProjectStatus.values.map(
                  (status) => DropdownMenuItem<PartOutProjectStatus?>(
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
              controller: _titleController,
              decoration: InputDecoration(labelText: i18n.t('Title contains')),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('Expected profit only')),
              value: _filter.onlyProfitableExpected,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(onlyProfitableExpected: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('Actual profit only')),
              value: _filter.onlyProfitableActual,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(onlyProfitableActual: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('Only with notes')),
              value: _filter.onlyWithNotes,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(onlyWithNotes: value);
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