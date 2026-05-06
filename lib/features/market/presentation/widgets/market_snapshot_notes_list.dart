import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';

class MarketSnapshotNotesList extends ConsumerWidget {
  final List<MarketSnapshotNoteModel> notes;

  const MarketSnapshotNotesList({
    super.key,
    required this.notes,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (notes.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Text(i18n.t('No notes yet.')),
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