import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';

class MarketSnapshotNotesList extends StatelessWidget {
  final List<MarketSnapshotNoteModel> notes;

  const MarketSnapshotNotesList({
    super.key,
    required this.notes,
  });

  @override
  Widget build(BuildContext context) {
    if (notes.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text('No notes yet.'),
        ),
      );
    }

    final sorted = [...notes]..sort((a, b) => b.createdAt.compareTo(a.createdAt));

    return Column(
      children: sorted
          .map(
            (note) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Card(
                child: ListTile(
                  title: Text(note.note),
                  subtitle: Text(
                    note.createdAt.toIso8601String().split('T').first,
                  ),
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}