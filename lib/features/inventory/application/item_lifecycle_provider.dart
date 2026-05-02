// lib/features/inventory/application/item_lifecycle_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/item_lifecycle_service.dart';

final itemLifecycleServiceProvider = Provider<ItemLifecycleService>((ref) {
  return ItemLifecycleService();
});
