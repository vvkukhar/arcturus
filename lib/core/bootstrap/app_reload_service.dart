import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_cleanup_report_model.dart';
import 'package:lego_trading_manager/core/storage/app_data_consistency_service_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

class AppReloadService {
  final Ref ref;

  const AppReloadService(this.ref);

  Future<void> reloadPersistentData() async {
    await Future.wait([
      ref.read(purchasesControllerProvider.notifier).load(),
      ref.read(salesControllerProvider.notifier).load(),
      ref.read(inventorySaleAllocationControllerProvider.notifier).load(),
      ref.read(salePurchaseLinkControllerProvider.notifier).load(),
    ]);

    await cleanupPersistentRelations();
  }

  Future<AppDataCleanupReportModel> cleanupPersistentRelations() async {
    final purchases = ref.read(purchasesControllerProvider);
    final sales = ref.read(salesControllerProvider);
    final allocations = ref.read(inventorySaleAllocationControllerProvider);
    final links = ref.read(salePurchaseLinkControllerProvider);

    final cleanup = ref.read(appDataConsistencyServiceProvider).cleanup(
          purchases: purchases,
          sales: sales,
          allocations: allocations,
          salePurchaseLinks: links,
        );

    if (cleanup.removedAllocations > 0 ||
        cleanup.adjustedAllocations > 0) {
      await ref
          .read(inventorySaleAllocationControllerProvider.notifier)
          .replaceAll(cleanup.allocations);
    }

    if (cleanup.removedLinks > 0) {
      await ref
          .read(salePurchaseLinkControllerProvider.notifier)
          .replaceAll(cleanup.salePurchaseLinks);
    }

    return AppDataCleanupReportModel(
      removedAllocations: cleanup.removedAllocations,
      removedLinks: cleanup.removedLinks,
      adjustedAllocations: cleanup.adjustedAllocations,
    );
  }
}

final appReloadServiceProvider = Provider<AppReloadService>((ref) {
  return AppReloadService(ref);
});