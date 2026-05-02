import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_query_provider.dart';

final marketVisibleNotesProvider =
    Provider<AsyncValue<List<MarketSnapshotNoteModel>>>((ref) {
  final notesAsync = ref.watch(marketSnapshotNotesProvider);
  final query = ref.watch(marketSnapshotNoteQueryProvider).trim().toLowerCase();
  final filter = ref.watch(marketNoteFilterProvider);

  return notesAsync.whenData((notes) {
    final visible = notes.where((note) {
      final matchesQuery = query.isEmpty ||
          note.note.toLowerCase().contains(query) ||
          note.snapshotId.toLowerCase().contains(query);

      final matchesSnapshot =
          (filter.snapshotIdContains ?? '').trim().isEmpty ||
              note.snapshotId.toLowerCase().contains(
                    filter.snapshotIdContains!.trim().toLowerCase(),
                  );

      final matchesFrom =
          filter.from == null || !note.createdAt.isBefore(filter.from!);
      final matchesTo =
          filter.to == null || !note.createdAt.isAfter(filter.to!);

      return matchesQuery && matchesSnapshot && matchesFrom && matchesTo;
    }).toList();

    visible.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return visible;
  });
});