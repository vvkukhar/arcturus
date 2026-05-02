import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_note_filter_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_query_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_service.dart';

final marketSnapshotNoteProvider = Provider<MarketSnapshotNoteService>((ref) {
  return MarketSnapshotNoteService(ref);
});

final marketSnapshotNotesProvider =
    FutureProvider<List<MarketSnapshotNoteModel>>((ref) async {
  return ref.watch(marketSnapshotNoteProvider).getAll();
});

final marketVisibleSnapshotNotesProvider =
    FutureProvider<List<MarketSnapshotNoteModel>>((ref) async {
  final allNotes = await ref.watch(marketSnapshotNotesProvider.future);
  final query =
      ref.watch(marketSnapshotNoteQueryProvider).trim().toLowerCase();
  final filter = ref.watch(marketNoteFilterProvider);

  final visible = allNotes.where((note) {
    final matchesQuery = query.isEmpty ||
        note.note.toLowerCase().contains(query) ||
        note.snapshotId.toLowerCase().contains(query);

    final snapshotFilter = (filter.snapshotIdContains ?? '').trim().toLowerCase();
    final matchesSnapshot =
        snapshotFilter.isEmpty || note.snapshotId.toLowerCase().contains(snapshotFilter);

    final matchesFrom =
        filter.from == null || !note.createdAt.isBefore(filter.from!);
    final matchesTo =
        filter.to == null || !note.createdAt.isAfter(filter.to!);

    return matchesQuery && matchesSnapshot && matchesFrom && matchesTo;
  }).toList();

  visible.sort((a, b) => b.createdAt.compareTo(a.createdAt));
  return visible;
});