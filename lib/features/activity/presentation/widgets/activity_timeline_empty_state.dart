import 'package:flutter/material.dart';

class ActivityTimelineEmptyState extends StatelessWidget {
  final VoidCallback onShowAll;
  final VoidCallback onShowReports;
  final VoidCallback onShowPurchases;

  const ActivityTimelineEmptyState({
    super.key,
    required this.onShowAll,
    required this.onShowReports,
    required this.onShowPurchases,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'No timeline entries found',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  FilledButton.tonal(
                    onPressed: onShowAll,
                    child: const Text('Show All'),
                  ),
                  FilledButton.tonal(
                    onPressed: onShowReports,
                    child: const Text('Reports'),
                  ),
                  FilledButton.tonal(
                    onPressed: onShowPurchases,
                    child: const Text('Purchases'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
