import 'package:flutter/material.dart';

class HomeRecentSearchesCard extends StatelessWidget {
  final List<String> queries;
  final ValueChanged<String> onTap;

  const HomeRecentSearchesCard({
    super.key,
    required this.queries,
    required this.onTap,
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
            const Text(
              'Recent Searches',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: queries.map((q) {
                return ActionChip(
                  label: Text(q),
                  onPressed: () => onTap(q),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}