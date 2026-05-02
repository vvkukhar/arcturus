import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_import_export_service.dart';

final currencyImportExportServiceProvider =
    Provider<CurrencyImportExportService>((ref) {
  return CurrencyImportExportService();
});
