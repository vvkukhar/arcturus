import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_bulk_actions_service.dart';

final purchasesBulkActionsProvider = Provider<PurchasesBulkActionsService>((ref) {
  return PurchasesBulkActionsService(PurchasesRepository());
});