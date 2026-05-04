import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class AnalyticsRepriceApplyService {
  final Ref ref;

  AnalyticsRepriceApplyService(this.ref);

  Future<void> applySuggestedPrice({
    required String itemId,
    required double suggestedPrice,
    required String title,
  }) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final item = repo.getById(itemId);
    if (item == null) return;

    await repo.updateItem(
      item.copyWith(expectedSalePrice: suggestedPrice),
    );

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Analytics repricing applied',
          subtitle: '$title -> ${suggestedPrice.toStringAsFixed(2)}',
        );
  }
}