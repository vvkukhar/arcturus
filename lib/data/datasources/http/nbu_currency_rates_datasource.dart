// lib/data/datasources/http/nbu_currency_rates_datasource.dart

import 'dart:convert';

import 'package:lego_trading_manager/core/constants/nbu_api_constants.dart';
import 'package:lego_trading_manager/core/services/http/http_client_abstraction.dart';
import 'package:lego_trading_manager/core/utils/date_to_nbu_format.dart';
import 'package:lego_trading_manager/core/utils/rate_units_helper.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/data/repositories/currency_rates_repository.dart';

class NbuCurrencyRatesDatasource implements AbstractCurrencyRatesDatasource {
  final HttpClientAbstraction httpClient;

  NbuCurrencyRatesDatasource(this.httpClient);

  @override
  Future<List<CurrencyRateModel>> fetchLatestRates() async {
    final raw = await httpClient.get(NbuApiConstants.currentJson);
    return _parse(raw);
  }

  @override
  Future<List<CurrencyRateModel>> fetchRatesByDate(DateTime date) async {
    final formatted = DateToNbuFormat.yyyymmdd(date);
    final url = NbuApiConstants.byDateJson.replaceAll('{date}', formatted);
    final raw = await httpClient.get(url);
    return _parse(raw);
  }

  List<CurrencyRateModel> _parse(String raw) {
    final decoded = jsonDecode(raw) as List;
    final now = DateTime.now();

    return decoded.map((e) {
      final map = Map<String, dynamic>.from(e as Map);

      final code = (map['cc'] ?? map['CurrencyCodeL'] ?? '').toString();
      final name = (map['txt'] ?? map['CurrencyName'])?.toString();
      final units =
          int.tryParse((map['r030'] ?? map['Units'] ?? 1).toString()) ?? 1;
      final amountRaw = (map['rate'] ?? map['Amount'] ?? 0) as num;
      final specialRaw = map['special']?.toString().trim();

      return CurrencyRateModel(
        code: code,
        name: name,
        rate: RateUnitsHelper.normalizeToSingleUnit(
          amount: amountRaw.toDouble(),
          units: units,
        ),
        baseCurrency: 'UAH',
        fetchedAt: now,
        source: 'nbu',
        units: units,
        special: specialRaw == null || specialRaw.isEmpty
            ? null
            : specialRaw.toUpperCase() == 'Y',
      );
    }).toList();
  }
}
