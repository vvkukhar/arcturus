import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/partout_project_status.dart';
import 'package:lego_trading_manager/features/partout/application/partout_filter_model.dart';

class PartOutFilterSheet extends StatefulWidget {
  final PartOutFilterModel initialFilter;

  const PartOutFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<PartOutFilterSheet> createState() => _PartOutFilterSheetState();
}

class _PartOutFilterSheetState extends State<PartOutFilterSheet> {
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
              'Part-out Filters',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<PartOutProjectStatus?>(
              value: _filter.status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: [
                const DropdownMenuItem<PartOutProjectStatus?>(
                  value: null,
                  child: Text('Any'),
                ),
                ...PartOutProjectStatus.values.map(
                  (status) => DropdownMenuItem<PartOutProjectStatus?>(
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
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'Title contains'),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Expected profit only'),
              value: _filter.onlyProfitableExpected,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(onlyProfitableExpected: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Actual profit only'),
              value: _filter.onlyProfitableActual,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(onlyProfitableActual: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Only with notes'),
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