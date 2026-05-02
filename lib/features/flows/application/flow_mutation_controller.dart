import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/offline/offline_mutation_service_provider.dart';
import 'package:lego_trading_manager/features/flows/application/purchase_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/reprice_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/application/review_flow_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_cached_repository_provider.dart';

class FlowMutationController {
  final Ref ref;
  FlowMutationController(this.ref);
  String _tempId(String prefix) {
    return '$prefix-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(99999)}';
  }

  Future<void> addPurchaseFlowOptimistic(String watchlistItemId) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedPurchaseFlow() ?? [];
    final optimistic = [
      ...current,
      {
        'id': _tempId('purchase'),
        'watchlistItemId': watchlistItemId,
        'status': 'pending',
        'createdAt': DateTime.now().toIso8601String(),
      }
    ];
    await cachedRepo.patchPurchaseFlow(optimistic);
    await offline.run(
      queueType: 'purchase_flow',
      endpoint: '/flows/purchase/add',
      method: 'POST',
      body: {'watchlistItemId': watchlistItemId},
    );
    ref.invalidate(purchaseFlowProvider);
  }

  Future<void> markPurchaseBoughtOptimistic({
    required String id,
    required double price,
    required int qty,
  }) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedPurchaseFlow() ?? [];
    final optimistic = current.map((item) {
      if (item['id'] == id) {
        return {
          ...item,
          'status': 'bought',
        };
      }
      return item;
    }).toList();
    await cachedRepo.patchPurchaseFlow(optimistic);
    await offline.run(
      queueType: 'purchase_flow',
      endpoint: '/flows/purchase/mark-bought',
      method: 'PATCH',
      body: {
        'id': id,
        'purchasePrice': price,
        'quantity': qty,
      },
    );
    ref.invalidate(purchaseFlowProvider);
  }

  Future<void> removePurchaseOptimistic(String id) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedPurchaseFlow() ?? [];
    final optimistic = current.where((item) => item['id'] != id).toList();
    await cachedRepo.patchPurchaseFlow(optimistic);
    await offline.run(
      queueType: 'purchase_flow',
      endpoint: '/flows/purchase/remove',
      method: 'PATCH',
      body: {'id': id},
    );
    ref.invalidate(purchaseFlowProvider);
  }

  Future<void> addRepriceFlowOptimistic(String inventoryItemId) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedRepriceFlow() ?? [];
    final optimistic = [
      ...current,
      {
        'id': _tempId('reprice'),
        'inventoryItemId': inventoryItemId,
        'status': 'pending',
        'createdAt': DateTime.now().toIso8601String(),
      }
    ];
    await cachedRepo.patchRepriceFlow(optimistic);
    await offline.run(
      queueType: 'reprice_flow',
      endpoint: '/flows/reprice/add',
      method: 'POST',
      body: {'inventoryItemId': inventoryItemId},
    );
    ref.invalidate(repriceFlowProvider);
  }

  Future<void> markRepriceListedOptimistic({
    required String id,
    required double price,
  }) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedRepriceFlow() ?? [];
    final optimistic = current.map((item) {
      if (item['id'] == id) {
        return {
          ...item,
          'status': 'listed',
        };
      }
      return item;
    }).toList();
    await cachedRepo.patchRepriceFlow(optimistic);
    await offline.run(
      queueType: 'reprice_flow',
      endpoint: '/flows/reprice/mark-listed',
      method: 'PATCH',
      body: {
        'id': id,
        'price': price,
      },
    );
    ref.invalidate(repriceFlowProvider);
  }

  Future<void> removeRepriceOptimistic(String id) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedRepriceFlow() ?? [];
    final optimistic = current.where((item) => item['id'] != id).toList();
    await cachedRepo.patchRepriceFlow(optimistic);
    await offline.run(
      queueType: 'reprice_flow',
      endpoint: '/flows/reprice/remove',
      method: 'PATCH',
      body: {'id': id},
    );
    ref.invalidate(repriceFlowProvider);
  }

  Future<void> addReviewFlowOptimistic({
    required String inventoryItemId,
    String? reason,
  }) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedReviewFlow() ?? [];
    final optimistic = [
      ...current,
      {
        'id': _tempId('review'),
        'inventoryItemId': inventoryItemId,
        'status': 'pending',
        'createdAt': DateTime.now().toIso8601String(),
      }
    ];
    await cachedRepo.patchReviewFlow(optimistic);
    await offline.run(
      queueType: 'review_flow',
      endpoint: '/flows/review/add',
      method: 'POST',
      body: {
        'inventoryItemId': inventoryItemId,
        'reason': reason,
      },
    );
    ref.invalidate(reviewFlowProvider);
  }

  Future<void> markReviewDoneOptimistic({
    required String id,
    String? note,
  }) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedReviewFlow() ?? [];
    final optimistic = current.map((item) {
      if (item['id'] == id) {
        return {
          ...item,
          'status': 'reviewed',
        };
      }
      return item;
    }).toList();
    await cachedRepo.patchReviewFlow(optimistic);
    await offline.run(
      queueType: 'review_flow',
      endpoint: '/flows/review/mark-reviewed',
      method: 'PATCH',
      body: {
        'id': id,
        'note': note,
      },
    );
    ref.invalidate(reviewFlowProvider);
  }

  Future<void> removeReviewOptimistic(String id) async {
    final cachedRepo = ref.read(flowsCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await cachedRepo.getCachedReviewFlow() ?? [];
    final optimistic = current.where((item) => item['id'] != id).toList();
    await cachedRepo.patchReviewFlow(optimistic);
    await offline.run(
      queueType: 'review_flow',
      endpoint: '/flows/review/remove',
      method: 'PATCH',
      body: {'id': id},
    );
    ref.invalidate(reviewFlowProvider);
  }
}

final flowMutationControllerProvider = Provider<FlowMutationController>((ref) {
  return FlowMutationController(ref);
});
