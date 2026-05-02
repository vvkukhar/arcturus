import 'package:flutter/material.dart';

class NbuApiNoteCard extends StatelessWidget {
  const NbuApiNoteCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text(
          'Official NBU rates are used as primary source. '
          'If request fails, cached data should be used as fallback. '
          'Manual rates are emergency override only.',
        ),
      ),
    );
  }
}