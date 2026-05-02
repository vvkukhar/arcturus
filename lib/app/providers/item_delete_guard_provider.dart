import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/services/item_delete_guard_service.dart';

final itemDeleteGuardServiceProvider = Provider<ItemDeleteGuardService>((ref) {
  return ItemDeleteGuardService(
    purchasesRepository: ref.read(purchasesRepositoryProvider),
    salesRepository: ref.read(salesRepositoryProvider),
  );
});
