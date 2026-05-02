import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/rate_sync_log_model.dart';
import 'package:lego_trading_manager/features/settings/application/currency_cache_keys.dart';

class RateSyncLogService {
  final Ref ref;

  RateSyncLogService(this.ref);

  Future<List<RateSyncLogModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(
          CurrencyCacheKeys.rateSyncLogs,
        );

    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List;
    return list
        .map(
          (e) => RateSyncLogModel.fromMap(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<void> add({
    required int rateCount,
    required bool success,
    String? note,
  }) async {
    final current = await getAll();
    final next = [
      RateSyncLogModel(
        id: IdGenerator.next(),
        syncedAt: DateTime.now(),
        rateCount: rateCount,
        success: success,
        note: note,
      ),
      ...current,
    ];

    await ref.read(cacheRepositoryProvider).set(
          CurrencyCacheKeys.rateSyncLogs,
          jsonEncode(next.map((e) => e.toMap()).toList()),
        );
  }
}