import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/turnover_bucket_model.dart';

final turnoverBucketsProvider = Provider<List<TurnoverBucketModel>>((ref) {
  final sold = ref.watch(inventoryRepositoryProvider).getSoldItems();

  int lt7 = 0;
  int d7_30 = 0;
  int d31_90 = 0;
  int gt90 = 0;

  for (final item in sold) {
    final days = item.daysInInventory ?? 0;
    if (days < 7) {
      lt7++;
    } else if (days <= 30) {
      d7_30++;
    } else if (days <= 90) {
      d31_90++;
    } else {
      gt90++;
    }
  }

  return [
    TurnoverBucketModel(label: '< 7d', count: lt7),
    TurnoverBucketModel(label: '7-30d', count: d7_30),
    TurnoverBucketModel(label: '31-90d', count: d31_90),
    TurnoverBucketModel(label: '> 90d', count: gt90),
  ];
});