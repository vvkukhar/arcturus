import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class AnalyticsBulkRepriceService {
  final Ref ref;

  AnalyticsBulkRepriceService(this.ref);

  Future<int> applyAllMarket98() async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();
    int affected = 0;

    final next = items.map((item) {
      if (item.marketAverage == null) return item;
      affected++;
      return item.copyWith(
        expectedSalePrice: item.marketAverage! * 0.98,
      );
    }).toList();

    await repo.replaceAll(next);

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Analytics bulk repricing',
          subtitle: 'Applied market 98% to $affected items',
        );

    return affected;
  }
}