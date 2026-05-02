import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

class MarketNoteFilterSheet extends StatefulWidget {
  final MarketNoteFilterModel initialFilter;

  const MarketNoteFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  State<MarketNoteFilterSheet> createState() => _MarketNoteFilterSheetState();
}

class _MarketNoteFilterSheetState extends State<MarketNoteFilterSheet> {
  late MarketNoteFilterModel _filter;
  late final TextEditingController _snapshotController;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _snapshotController = TextEditingController(
      text: widget.initialFilter.snapshotIdContains ?? '',
    );
  }

  @override
  void dispose() {
    _snapshotController.dispose();
    super.dispose();
  }

  Future<void> _pickDate({required bool from}) async {
    final now = DateTime.now();
    final initial = from ? (_filter.from ?? now) : (_filter.to ?? now);

    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
      initialDate: initial,
    );

    if (picked == null) return;

    setState(() {
      _filter =
          from ? _filter.copyWith(from: picked) : _filter.copyWith(to: picked);
    });
  }

  void _apply() {
    Navigator.of(context).pop(
      _filter.copyWith(
        snapshotIdContains: _snapshotController.text.trim().isEmpty
            ? null
            : _snapshotController.text.trim(),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(MarketNoteFilterModel.empty);
  }

  @override
  Widget build(BuildContext context) {
    final fromText =
        _filter.from == null ? 'Date from' : _filter.from!.toIso8601String().split('T').first;
    final toText =
        _filter.to == null ? 'Date to' : _filter.to!.toIso8601String().split('T').first;

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
              'Market Notes Filters',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _snapshotController,
              decoration:
                  const InputDecoration(labelText: 'Snapshot ID contains'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _pickDate(from: true),
                    child: Text(fromText),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _pickDate(from: false),
                    child: Text(toText),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (_filter.from != null || _filter.to != null)
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton(
                  onPressed: () {
                    setState(() {
                      _filter = _filter.copyWith(
                        clearFrom: true,
                        clearTo: true,
                      );
                    });
                  },
                  child: const Text('Clear dates'),
                ),
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