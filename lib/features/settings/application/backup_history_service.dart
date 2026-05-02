import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/features/settings/application/backup_history_entry_model.dart';

class BackupHistoryService {
  final Ref ref;

  static const String _key = 'backup_history_entries';

  BackupHistoryService(this.ref);

  Future<List<BackupHistoryEntryModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List<dynamic>;

    return list.map((e) {
      final map = Map<String, dynamic>.from(e as Map);
      return BackupHistoryEntryModel(
        id: map['id'] as String,
        createdAt: DateTime.parse(map['createdAt'] as String),
        fileName: map['fileName'] as String,
        recordCount: (map['recordCount'] as num).toInt(),
        type: map['type'] as String,
      );
    }).toList();
  }

  Future<void> add({
    required String fileName,
    required int recordCount,
    required String type,
  }) async {
    final current = await getAll();

    final next = [
      BackupHistoryEntryModel(
        id: IdGenerator.next(),
        createdAt: DateTime.now(),
        fileName: fileName,
        recordCount: recordCount,
        type: type,
      ),
      ...current,
    ];

    await ref.read(cacheRepositoryProvider).set(
          _key,
          jsonEncode(
            next
                .map(
                  (e) => {
                    'id': e.id,
                    'createdAt': e.createdAt.toIso8601String(),
                    'fileName': e.fileName,
                    'recordCount': e.recordCount,
                    'type': e.type,
                  },
                )
                .toList(),
          ),
        );
  }

  Future<void> clear() async {
    await ref.read(cacheRepositoryProvider).delete(_key);
  }
}