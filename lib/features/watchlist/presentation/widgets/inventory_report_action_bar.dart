import 'package:flutter/material.dart';

class InventoryReportActionBar extends StatelessWidget {
  final VoidCallback onSaveInventoryReport;
  final VoidCallback onSaveDeadStockReport;

  const InventoryReportActionBar({
    super.key,
    required this.onSaveInventoryReport,
    required this.onSaveDeadStockReport,
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
              onPressed: onSaveInventoryReport,
              icon: const Icon(Icons.note_alt_outlined),
              label: const Text('Inventory Report'),
            ),
            FilledButton.tonalIcon(
              onPressed: onSaveDeadStockReport,
              icon: const Icon(Icons.warning_amber_outlined),
              label: const Text('Dead Stock Report'),
            ),
          ],
        ),
      ),
    );
  }
}