import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/data/flows_cached_repository_provider.dart';

class PurchaseFlowItemModel {
  final String id;
  final String watchlistItemId;
  final String status;
  final DateTime? createdAt;
  const PurchaseFlowItemModel({
    required this.id,
    required this.watchlistItemId,
    required this.status,
    required this.createdAt,
  });
  factory PurchaseFlowItemModel.fromJson(Map<String, dynamic> json) {
    return PurchaseFlowItemModel(
      id: json['id'] as String? ?? '',
      watchlistItemId: json['watchlistItemId'] as String? ?? '',
      status: json['status'] as String? ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'watchlistItemId': watchlistItemId,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  PurchaseFlowItemModel copyWith({
    String? id,
    String? watchlistItemId,
    String? status,
    DateTime? createdAt,
  }) {
    return PurchaseFlowItemModel(
      id: id ?? this.id,
      watchlistItemId: watchlistItemId ?? this.watchlistItemId,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

final purchaseFlowProvider =
    FutureProvider<List<PurchaseFlowItemModel>>((ref) async {
  final repo = ref.watch(flowsCachedRepositoryProvider);
  final json = await repo.getPurchaseFlow();
  return json.map(PurchaseFlowItemModel.fromJson).toList();
});
