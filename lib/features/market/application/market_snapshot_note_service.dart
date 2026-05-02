import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_note_model.dart';

class MarketSnapshotNoteService {
  final Ref ref;
  static const String _key = 'market_snapshot_notes';

  MarketSnapshotNoteService(this.ref);

  Future<List<MarketSnapshotNoteModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List<dynamic>;

    final result = list.map((entry) {
      final map = Map<String, dynamic>.from(entry as Map);
      return MarketSnapshotNoteModel(
        snapshotId: map['snapshotId'] as String,
        note: map['note'] as String,
        createdAt: DateTime.parse(map['createdAt'] as String),
      );
    }).toList();

    result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return result;
  }

  Future<List<MarketSnapshotNoteModel>> getBySnapshotId(String snapshotId) async {
    final all = await getAll();
    return all.where((entry) => entry.snapshotId == snapshotId).toList();
  }

  Future<void> add({
    required String snapshotId,
    required String note,
  }) async {
    final trimmed = note.trim();
    if (trimmed.isEmpty) return;

    final current = await getAll();

    final next = [
      MarketSnapshotNoteModel(
        snapshotId: snapshotId,
        note: trimmed,
        createdAt: DateTime.now(),
      ),
      ...current,
    ];

    await ref.read(cacheRepositoryProvider).set(
          _key,
          jsonEncode(
            next
                .map(
                  (entry) => {
                    'snapshotId': entry.snapshotId,
                    'note': entry.note,
                    'createdAt': entry.createdAt.toIso8601String(),
                  },
                )
                .toList(),
          ),
        );
  }
}