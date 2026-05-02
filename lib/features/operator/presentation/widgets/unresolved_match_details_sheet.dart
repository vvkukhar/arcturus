import 'package:flutter/material.dart';

class UnresolvedMatchDetailsSheet extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onResolve;
  final VoidCallback onDismiss;

  const UnresolvedMatchDetailsSheet({
    super.key,
    required this.item,
    required this.onResolve,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final listing = Map<String, dynamic>.from(item['listing'] as Map? ?? {});
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            item['titleRaw'] as String? ?? '',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          Text('Source: ${item['sourceCode'] ?? '-'}'),
          Text('Normalized: ${item['normalizedTitle'] ?? '-'}'),
          Text('Extracted set: ${item['extractedSetNo'] ?? '-'}'),
          Text('Suggested item: ${item['suggestedItemId'] ?? '-'}'),
          const SizedBox(height: 12),
          Text('Listing URL: ${listing['url'] ?? '-'}'),
          Text(
              'Raw price: ${listing['price'] ?? '-'} ${listing['currency'] ?? ''}'),
          Text('Seller: ${listing['sellerName'] ?? '-'}'),
          Text('Condition: ${listing['condition'] ?? '-'}'),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              FilledButton(
                onPressed: onResolve,
                child: const Text('Resolve'),
              ),
              FilledButton.tonal(
                onPressed: onDismiss,
                child: const Text('Dismiss'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
