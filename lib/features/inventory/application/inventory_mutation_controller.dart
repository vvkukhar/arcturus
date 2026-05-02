import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/offline/offline_mutation_service_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_provider.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_cached_repository_provider.dart';

class InventoryMutationController {
  final Ref ref;

  InventoryMutationController(this.ref);

  String _tempId() {
    return 'inv-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(99999)}';
  }

  Future<void> addOptimistic({
    required String itemId,
    required String title,
    required double price,
  }) async {
    final repo = ref.read(inventoryCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await repo.getInventory();

    final optimistic = [
      ...current,
      {
        'id': _tempId(),
        'itemId': itemId,
        'title': title,
        'purchasePrice': price,
      },
    ];

    await repo.putInventoryCache(optimistic);

    await offline.run(
      queueType: 'inventory',
      endpoint: '/inventory/add',
      method: 'POST',
      body: {
        'itemId': itemId,
        'title': title,
        'purchasePrice': price,
      },
    );

    ref.invalidate(inventoryProvider);
  }
}

final inventoryMutationControllerProvider =
    Provider<InventoryMutationController>((ref) {
  return InventoryMutationController(ref);
});