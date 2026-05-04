// lib/features/purchases/application/purchases_bulk_actions_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_bulk_actions_service.dart';

final purchasesBulkActionsProvider = Provider<PurchasesBulkActionsService>((ref) {
  return PurchasesBulkActionsService(ref.watch(purchasesRepositoryProvider));
});