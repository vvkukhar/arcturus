import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/services/trading_transaction_service.dart';

final tradingTransactionServiceProvider =
    Provider<TradingTransactionService>((ref) {
  return TradingTransactionService(
    inventoryRepository: ref.read(inventoryRepositoryProvider),
    purchasesRepository: ref.read(purchasesRepositoryProvider),
    salesRepository: ref.read(salesRepositoryProvider),
  );
});
