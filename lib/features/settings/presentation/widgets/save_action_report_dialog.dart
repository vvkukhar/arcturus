import 'package:flutter/material.dart';

class SaveActionReportDialog extends StatefulWidget {
  final String initialTitle;
  final String initialNote;

  const SaveActionReportDialog({
    super.key,
    required this.initialTitle,
    required this.initialNote,
  });

  @override
  State<SaveActionReportDialog> createState() => _SaveActionReportDialogState();
}

class _SaveActionReportDialogState extends State<SaveActionReportDialog> {
  late final TextEditingController _titleController;
  late final TextEditingController _noteController;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.initialTitle);
    _noteController = TextEditingController(text: widget.initialNote);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _submit() {
    Navigator.of(context).pop({
      'title': _titleController.text.trim(),
      'note': _noteController.text.trim(),
    });
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Save Action Report'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Title'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _noteController,
            minLines: 3,
            maxLines: 6,
            decoration: const InputDecoration(labelText: 'Note'),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _submit,
          child: const Text('Save'),
        ),
      ],
    );
  }
}