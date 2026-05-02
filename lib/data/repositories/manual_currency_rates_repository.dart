// lib/data/repositories/manual_currency_rates_repository.dart

import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

abstract class AbstractManualCurrencyRatesDatasource {
  Future<List<ManualCurrencyRateModel>> getAll();
  Future<void> saveAll(List<ManualCurrencyRateModel> items);
}

class ManualCurrencyRatesRepository {
  final AbstractManualCurrencyRatesDatasource datasource;

  ManualCurrencyRatesRepository(this.datasource);

  Future<List<ManualCurrencyRateModel>> getAll() {
    return datasource.getAll();
  }

  Future<void> upsert({
    required String code,
    required double rateToUah,
  }) async {
    final all = await datasource.getAll();
    final normalized = code.trim().toUpperCase();

    final next = [...all];
    final index = next.indexWhere((e) => e.code == normalized);

    final item = ManualCurrencyRateModel(
      code: normalized,
      rateToUah: rateToUah,
      updatedAt: DateTime.now(),
    );

    if (index == -1) {
      next.add(item);
    } else {
      next[index] = item;
    }

    await datasource.saveAll(next);
  }
}
