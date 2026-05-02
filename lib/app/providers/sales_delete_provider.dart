import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/app/providers/sale_rollback_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sales_delete_service.dart';

final salesDeleteServiceProvider = Provider<SalesDeleteService>((ref) {
  return SalesDeleteService(
    salesRepository: ref.read(salesRepositoryProvider),
    inventoryRepository: ref.read(inventoryRepositoryProvider),
    rollbackService: ref.read(saleRollbackServiceProvider),
  );
});
