import 'package:flutter/material.dart';

class GlobalSearchRecentQueries extends StatelessWidget {
  final List<String> queries;
  final ValueChanged<String> onTapQuery;
  final ValueChanged<String> onRemoveQuery;
  final VoidCallback onClearAll;

  const GlobalSearchRecentQueries({
    super.key,
    required this.queries,
    required this.onTapQuery,
    required this.onRemoveQuery,
    required this.onClearAll,
  });

  @override
  Widget build(BuildContext context) {
    if (queries.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Recent Queries',
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                TextButton(
                  onPressed: onClearAll,
                  child: const Text('Clear'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: queries.map((query) {
                return InputChip(
                  label: Text(query),
                  onPressed: () => onTapQuery(query),
                  onDeleted: () => onRemoveQuery(query),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}