// lib/features/item_details/presentation/widgets/item_detail_tags_card.dart

import 'package:flutter/material.dart';

class ItemDetailTagsCard extends StatelessWidget {
  final List<String> tags;

  const ItemDetailTagsCard({
    super.key,
    required this.tags,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: tags.isEmpty
            ? const Text('-')
            : Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tags
                    .map(
                      (tag) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(tag),
                      ),
                    )
                    .toList(),
              ),
      ),
    );
  }
}
