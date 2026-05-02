import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_cache_keys.dart';

class OfficialRatesCacheService {
  final Ref ref;

  OfficialRatesCacheService(this.ref);

  Future<void> save(List<Map<String, dynamic>> rawRates) async {
    await ref.read(cacheRepositoryProvider).set(
          CurrencyCacheKeys.officialRates,
          jsonEncode(rawRates),
        );

    await ref.read(cacheRepositoryProvider).set(
          CurrencyCacheKeys.officialRatesFetchedAt,
          DateTime.now().toIso8601String(),
        );
  }

  Future<List<Map<String, dynamic>>> load() async {
    final raw = await ref.read(cacheRepositoryProvider).get(
          CurrencyCacheKeys.officialRates,
        );

    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List;
    return list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
  }

  Future<DateTime?> loadFetchedAt() async {
    final raw = await ref.read(cacheRepositoryProvider).get(
          CurrencyCacheKeys.officialRatesFetchedAt,
        );

    if (raw == null || raw.isEmpty) return null;
    return DateTime.tryParse(raw);
  }

  Future<void> clear() async {
    await ref.read(cacheRepositoryProvider).delete(
          CurrencyCacheKeys.officialRates,
        );
    await ref.read(cacheRepositoryProvider).delete(
          CurrencyCacheKeys.officialRatesFetchedAt,
        );
  }
}