import 'package:flutter/material.dart';

class ItemDetailNotesCard extends StatelessWidget {
  final String? notes;

  const ItemDetailNotesCard({
    super.key,
    required this.notes,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          (notes ?? '').trim().isEmpty ? '-' : notes!,
        ),
      ),
    );
  }
}