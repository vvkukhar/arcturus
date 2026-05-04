import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/velocity_bucket_model.dart';

final velocityTrackingProvider = Provider<List<VelocityBucketModel>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  int fast = 0;
  int medium = 0;
  int slow = 0;
  int dead = 0;

  for (final item in items) {
    final days = item.daysInInventory ?? 0;

    if (days <= 14) {
      fast++;
    } else if (days <= 45) {
      medium++;
    } else if (days <= 90) {
      slow++;
    } else {
      dead++;
    }
  }

  return [
    VelocityBucketModel(label: '0-14d', count: fast),
    VelocityBucketModel(label: '15-45d', count: medium),
    VelocityBucketModel(label: '46-90d', count: slow),
    VelocityBucketModel(label: '90d+', count: dead),
  ];
});