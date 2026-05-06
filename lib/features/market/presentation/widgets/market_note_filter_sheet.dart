import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_model.dart';

class MarketNoteFilterSheet extends ConsumerStatefulWidget {
  final MarketNoteFilterModel initialFilter;

  const MarketNoteFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  ConsumerState<MarketNoteFilterSheet> createState() => _MarketNoteFilterSheetState();
}

class _MarketNoteFilterSheetState extends ConsumerState<MarketNoteFilterSheet> {
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
    final i18n = ref.watch(i18nProvider.notifier);
    final fromText =
        _filter.from == null ? i18n.t('Date from') : _filter.from!.toIso8601String().split('T').first;
    final toText =
        _filter.to == null ? i18n.t('Date to') : _filter.to!.toIso8601String().split('T').first;

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
              i18n.t('Market Notes Filters'),
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _snapshotController,
              decoration:
                  InputDecoration(labelText: i18n.t('Snapshot ID contains')),
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
                  child: Text(i18n.t('Clear dates')),
                ),
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