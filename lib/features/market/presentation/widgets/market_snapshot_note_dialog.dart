import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class MarketSnapshotNoteDialog extends ConsumerStatefulWidget {
  final String initialValue;

  const MarketSnapshotNoteDialog({
    super.key,
    required this.initialValue,
  });

  @override
  ConsumerState<MarketSnapshotNoteDialog> createState() =>
      _MarketSnapshotNoteDialogState();
}

class _MarketSnapshotNoteDialogState extends ConsumerState<MarketSnapshotNoteDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _save() {
    Navigator.of(context).pop(_controller.text.trim());
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return AlertDialog(
      title: Text(i18n.t('Save Market Note')),
      content: TextField(
        controller: _controller,
        minLines: 4,
        maxLines: 8,
        decoration: InputDecoration(
          labelText: i18n.t('inv.notes'),
          alignLabelWithHint: true,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(i18n.t('common.cancel')),
        ),
        FilledButton(
          onPressed: _save,
          child: Text(i18n.t('common.save')),
        ),
      ],
    );
  }
}