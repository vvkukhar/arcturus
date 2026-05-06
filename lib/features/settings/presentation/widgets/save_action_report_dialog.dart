import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SaveActionReportDialog extends ConsumerStatefulWidget {
  final String initialTitle;
  final String initialNote;

  const SaveActionReportDialog({
    super.key,
    required this.initialTitle,
    required this.initialNote,
  });

  @override
  ConsumerState<SaveActionReportDialog> createState() => _SaveActionReportDialogState();
}

class _SaveActionReportDialogState extends ConsumerState<SaveActionReportDialog> {
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
    final i18n = ref.watch(i18nProvider.notifier);

    return AlertDialog(
      title: Text(i18n.t('Save Action Report')),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _titleController,
            decoration: InputDecoration(labelText: i18n.t('Title')),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _noteController,
            minLines: 3,
            maxLines: 6,
            decoration: InputDecoration(labelText: i18n.t('inv.notes')),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(i18n.t('common.cancel')),
        ),
        FilledButton(
          onPressed: _submit,
          child: Text(i18n.t('common.save')),
        ),
      ],
    );
  }
}