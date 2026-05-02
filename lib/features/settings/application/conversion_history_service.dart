// lib/features/settings/application/conversion_history_service.dart

import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/cache_repository_provider.dart';
import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/currency_conversion_record_model.dart';
import 'package:lego_trading_manager/features/settings/application/currency_cache_keys.dart';

class ConversionHistoryService {
  final Ref ref;

  ConversionHistoryService(this.ref);

  Future<List<CurrencyConversionRecordModel>> getAll() async {
    final raw = await ref.read(cacheRepositoryProvider).get(
          CurrencyCacheKeys.conversionHistory,
        );

    if (raw == null || raw.isEmpty) return [];

    final list = jsonDecode(raw) as List;
    return list
        .map(
          (e) => CurrencyConversionRecordModel.fromMap(
            Map<String, dynamic>.from(e as Map),
          ),
        )
        .toList();
  }

  Future<void> add({
    required String fromCurrency,
    required String toCurrency,
    required double inputAmount,
    required double rate,
    required double outputAmount,
  }) async {
    final current = await getAll();

    final next = [
      CurrencyConversionRecordModel(
        id: IdGenerator.next(),
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        inputAmount: inputAmount,
        rate: rate,
        outputAmount: outputAmount,
        createdAt: DateTime.now(),
      ),
      ...current,
    ];

    await ref.read(cacheRepositoryProvider).set(
          CurrencyCacheKeys.conversionHistory,
          jsonEncode(next.map((e) => e.toMap()).toList()),
        );
  }

  Future<void> clear() async {
    await ref.read(cacheRepositoryProvider).delete(
          CurrencyCacheKeys.conversionHistory,
        );
  }
}
