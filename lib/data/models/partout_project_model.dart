// lib/data/models/partout_project_model.dart

import 'package:lego_trading_manager/core/enums/partout_project_status.dart';

class PartOutProjectModel {
  final String id;
  final String sourceSetId;
  final String sourceSetTitle;
  final double purchaseCost;
  final double shippingCost;
  final double extraCosts;
  final double totalCost;
  final double expectedPartOutValue;
  final double actualPartOutValue;
  final PartOutProjectStatus status;
  final String? notes;
  final DateTime createdAt;

  const PartOutProjectModel({
    required this.id,
    required this.sourceSetId,
    required this.sourceSetTitle,
    required this.purchaseCost,
    required this.shippingCost,
    required this.extraCosts,
    required this.totalCost,
    required this.expectedPartOutValue,
    required this.actualPartOutValue,
    required this.status,
    this.notes,
    required this.createdAt,
  });

  PartOutProjectModel copyWith({
    String? id,
    String? sourceSetId,
    String? sourceSetTitle,
    double? purchaseCost,
    double? shippingCost,
    double? extraCosts,
    double? totalCost,
    double? expectedPartOutValue,
    double? actualPartOutValue,
    PartOutProjectStatus? status,
    String? notes,
    DateTime? createdAt,
  }) {
    return PartOutProjectModel(
      id: id ?? this.id,
      sourceSetId: sourceSetId ?? this.sourceSetId,
      sourceSetTitle: sourceSetTitle ?? this.sourceSetTitle,
      purchaseCost: purchaseCost ?? this.purchaseCost,
      shippingCost: shippingCost ?? this.shippingCost,
      extraCosts: extraCosts ?? this.extraCosts,
      totalCost: totalCost ?? this.totalCost,
      expectedPartOutValue: expectedPartOutValue ?? this.expectedPartOutValue,
      actualPartOutValue: actualPartOutValue ?? this.actualPartOutValue,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'sourceSetId': sourceSetId,
      'sourceSetTitle': sourceSetTitle,
      'purchaseCost': purchaseCost,
      'shippingCost': shippingCost,
      'extraCosts': extraCosts,
      'totalCost': totalCost,
      'expectedPartOutValue': expectedPartOutValue,
      'actualPartOutValue': actualPartOutValue,
      'status': status.name,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PartOutProjectModel.fromMap(Map<String, dynamic> map) {
    return PartOutProjectModel(
      id: map['id'] as String,
      sourceSetId: map['sourceSetId'] as String,
      sourceSetTitle: map['sourceSetTitle'] as String,
      purchaseCost: (map['purchaseCost'] as num).toDouble(),
      shippingCost: (map['shippingCost'] as num).toDouble(),
      extraCosts: (map['extraCosts'] as num).toDouble(),
      totalCost: (map['totalCost'] as num).toDouble(),
      expectedPartOutValue: (map['expectedPartOutValue'] as num).toDouble(),
      actualPartOutValue: (map['actualPartOutValue'] as num).toDouble(),
      status: PartOutProjectStatus.values.byName(map['status'] as String),
      notes: map['notes'] as String?,
      createdAt: DateTime.parse(map['createdAt'] as String),
    );
  }
}
