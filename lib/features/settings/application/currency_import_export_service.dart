// lib/features/settings/application/currency_import_export_service.dart

import 'dart:convert';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class CurrencyImportExportService {
  String exportManualRates(List<ManualCurrencyRateModel> items) {
    return const JsonEncoder.withIndent('  ')
        .convert(items.map((e) => e.toMap()).toList());
  }

  List<ManualCurrencyRateModel> importManualRates(String raw) {
    final list = jsonDecode(raw) as List<dynamic>;
    return list
        .map(
          (e) => ManualCurrencyRateModel.fromMap(
            Map<String, dynamic>.from(e as Map),
          ),
        )
        .toList();
  }
}
