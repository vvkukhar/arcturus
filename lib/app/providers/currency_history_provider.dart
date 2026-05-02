import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/currency_repositories_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_history_service.dart';

final currencyHistoryServiceProvider = Provider<CurrencyHistoryService>((ref) {
  return CurrencyHistoryService(ref.read(currencyRatesRepositoryProvider));
});
