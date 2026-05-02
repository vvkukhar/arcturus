import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/data/flows_cached_repository_provider.dart';

class RepriceFlowItemModel {
  final String id;
  final String inventoryItemId;
  final String status;
  final DateTime? createdAt;
  const RepriceFlowItemModel({
    required this.id,
    required this.inventoryItemId,
    required this.status,
    required this.createdAt,
  });
  factory RepriceFlowItemModel.fromJson(Map<String, dynamic> json) {
    return RepriceFlowItemModel(
      id: json['id'] as String? ?? '',
      inventoryItemId: json['inventoryItemId'] as String? ?? '',
      status: json['status'] as String? ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String)
          : null,
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'inventoryItemId': inventoryItemId,
      'status': status,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  RepriceFlowItemModel copyWith({
    String? id,
    String? inventoryItemId,
    String? status,
    DateTime? createdAt,
  }) {
    return RepriceFlowItemModel(
      id: id ?? this.id,
      inventoryItemId: inventoryItemId ?? this.inventoryItemId,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

final repriceFlowProvider =
    FutureProvider<List<RepriceFlowItemModel>>((ref) async {
  final repo = ref.watch(flowsCachedRepositoryProvider);
  final json = await repo.getRepriceFlow();
  return json.map(RepriceFlowItemModel.fromJson).toList();
});
