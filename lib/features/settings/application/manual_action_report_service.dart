import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/settings/application/manual_action_report_model.dart';

class ManualActionReportService {
  final Ref ref;
  static const String _key = 'manual_action_reports';

  ManualActionReportService(this.ref);

  Future<List<ManualActionReportModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(_key);
    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List<dynamic>;
    return list.map((e) {
      final map = Map<String, dynamic>.from(e as Map);
      return ManualActionReportModel(
        title: map['title'] as String,
        note: map['note'] as String,
        createdAt: DateTime.parse(map['createdAt'] as String),
      );
    }).toList();
  }

  Future<void> add({
    required String title,
    required String note,
  }) async {
    final current = await getAll();
    final next = [
      ManualActionReportModel(
        title: title,
        note: note,
        createdAt: DateTime.now(),
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
                    'note': e.note,
                    'createdAt': e.createdAt.toIso8601String(),
                  },
                )
                .toList(),
          ),
        );
  }
}