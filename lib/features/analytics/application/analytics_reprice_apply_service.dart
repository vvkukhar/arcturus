// lib/features/analytics/application/analytics_reprice_apply_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class AnalyticsRepriceApplyService {
  final Ref ref;

  AnalyticsRepriceApplyService(this.ref);

  Future<void> applySuggestedPrice({
    required String itemId,
    required double suggestedPrice,
    required String title,
  }) async {
    final repo = InventoryRepository();
    final item = repo.getById(itemId);
    if (item == null) return;

    repo.updateItem(
      item.copyWith(expectedSalePrice: suggestedPrice),
    );

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Analytics repricing applied',
          subtitle: '$title → ${suggestedPrice.toStringAsFixed(2)}',
        );
  }
}
