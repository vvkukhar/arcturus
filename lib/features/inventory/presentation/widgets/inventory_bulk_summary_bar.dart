import 'package:flutter/material.dart';

class InventoryBulkSummaryBar extends StatelessWidget {
  final int selectedCount;
  final int totalVisibleCount;
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const InventoryBulkSummaryBar({
    super.key,
    required this.selectedCount,
    required this.totalVisibleCount,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.checklist_rtl),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Selected: $selectedCount / $totalVisibleCount',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                OutlinedButton.icon(
                  onPressed: onSelectAll,
                  icon: const Icon(Icons.select_all),
                  label: const Text('Select All Visible'),
                ),
                OutlinedButton.icon(
                  onPressed: onClear,
                  icon: const Icon(Icons.clear_all),
                  label: const Text('Clear'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
