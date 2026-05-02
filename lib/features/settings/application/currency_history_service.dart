import 'package:lego_trading_manager/data/repositories/currency_rates_repository.dart';
import 'package:lego_trading_manager/features/settings/application/currency_history_entry_model.dart';

class CurrencyHistoryService {
  final CurrencyRatesRepository repository;

  CurrencyHistoryService(this.repository);

  Future<List<CurrencyHistoryEntryModel>> fetchLastDays({
    required String code,
    required int days,
  }) async {
    final list = <CurrencyHistoryEntryModel>[];

    for (int i = 0; i < days; i++) {
      final date = DateTime.now().subtract(Duration(days: i));

      try {
        final rates = await repository.fetchByDate(date);
        final item = rates.firstWhere((e) => e.code == code);

        list.add(
          CurrencyHistoryEntryModel(
            date: date,
            code: code,
            rate: item.rate,
          ),
        );
      } catch (_) {}
    }

    return list;
  }
}
