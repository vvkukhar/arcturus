// lib/features/activity/application/activity_log_service.dart
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_entry_model.dart';

class ActivityLogService {
  final Ref ref;
  static const String _key = 'activity_log_entries';

  ActivityLogService(this.ref);

  Future<List<ActivityLogEntryModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return [];
    final list = jsonDecode(raw) as List<dynamic>;
    return list.map((e) {
      final map = Map<String, dynamic>.from(e as Map);
      return ActivityLogEntryModel(
        title: map['title'] as String,
        subtitle: map['subtitle'] as String,
        createdAt: DateTime.parse(map['createdAt'] as String),
        type: map['type'] as String,
      );
    }).toList();
  }

  Future<void> add({
    required String title,
    required String subtitle,
    required String type,
  }) async {
    final current = await getAll();
    final next = [
      ActivityLogEntryModel(
        title: title,
        subtitle: subtitle,
        createdAt: DateTime.now(),
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
                    'title': e.title,
                    'subtitle': e.subtitle,
                    'createdAt': e.createdAt.toIso8601String(),
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
