// lib/features/market/presentation/widgets/market_snapshot_report_bar.dart
import 'package:flutter/material.dart';

class MarketSnapshotReportBar extends StatelessWidget {
  final VoidCallback onSaveNote;
  final VoidCallback onSaveReport;

  const MarketSnapshotReportBar({
    super.key,
    required this.onSaveNote,
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
            FilledButton.tonalIcon(
              onPressed: onSaveNote,
              icon: const Icon(Icons.sticky_note_2_outlined),
              label: const Text('Save Note'),
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
