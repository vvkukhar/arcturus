// lib/features/market/presentation/widgets/market_snapshot_note_dialog.dart
import 'package:flutter/material.dart';

class MarketSnapshotNoteDialog extends StatefulWidget {
  final String initialValue;

  const MarketSnapshotNoteDialog({
    super.key,
    required this.initialValue,
  });

  @override
  State<MarketSnapshotNoteDialog> createState() =>
      _MarketSnapshotNoteDialogState();
}

class _MarketSnapshotNoteDialogState extends State<MarketSnapshotNoteDialog> {
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
    return AlertDialog(
      title: const Text('Save Market Note'),
      content: TextField(
        controller: _controller,
        minLines: 4,
        maxLines: 8,
        decoration: const InputDecoration(
          labelText: 'Note',
          alignLabelWithHint: true,
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _save,
          child: const Text('Save'),
        ),
      ],
    );
  }
}
