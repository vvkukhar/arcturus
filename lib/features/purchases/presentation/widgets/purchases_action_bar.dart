import 'package:flutter/material.dart';

class PurchasesActionBar extends StatelessWidget {
  final VoidCallback onAdd;
  final VoidCallback onExport;
  final VoidCallback onSaveReport;

  const PurchasesActionBar({
    super.key,
    required this.onAdd,
    required this.onExport,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.icon(
              onPressed: onAdd,
              icon: const Icon(Icons.add),
              label: const Text('Add Purchase'),
            ),
            FilledButton.tonalIcon(
              onPressed: onExport,
              icon: const Icon(Icons.file_download_outlined),
              label: const Text('Export'),
            ),
            FilledButton.tonalIcon(
              onPressed: onSaveReport,
              icon: const Icon(Icons.note_add_outlined),
              label: const Text('Save Report'),
            ),
          ],
        ),
      ),
    );
  }
}