// lib/features/settings/application/official_rate_sync_service.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/nbu_currency_api_provider.dart';
import 'package:lego_trading_manager/app/providers/official_rates_cache_provider.dart';
import 'package:lego_trading_manager/app/providers/rate_sync_log_provider.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class OfficialRateSyncService {
  final Ref ref;

  OfficialRateSyncService(this.ref);

  Future<List<CurrencyRateModel>> sync() async {
    try {
      final raw = await ref.read(nbuCurrencyApiProvider).fetchLatest();
      await ref.read(officialRatesCacheServiceProvider).save(raw);

      final now = DateTime.now();

      final parsed = raw.map((e) {
        return CurrencyRateModel(
          code: (e['cc'] as String?) ?? '',
          name: (e['txt'] as String?) ?? '',
          rate: ((e['rate'] as num?) ?? 0).toDouble(),
          baseCurrency: 'UAH',
          fetchedAt: now,
          source: 'nbu',
          units: 1,
          special: null,
        );
      }).toList();

      await ref.read(rateSyncLogServiceProvider).add(
            rateCount: parsed.length,
            success: true,
            note: 'Official NBU sync success',
          );

      return parsed;
    } catch (e) {
      await ref.read(rateSyncLogServiceProvider).add(
            rateCount: 0,
            success: false,
            note: e.toString(),
          );
      rethrow;
    }
  }
}
