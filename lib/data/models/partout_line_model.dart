// lib/data/models/partout_line_model.dart

import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/partout_line_status.dart';

class PartOutLineModel {
  final String id;
  final String projectId;
  final ItemType itemType;
  final String? itemRef;
  final String title;
  final int quantity;
  final double expectedUnitPrice;
  final double expectedTotalPrice;
  final double actualTotalPrice;
  final PartOutLineStatus status;

  const PartOutLineModel({
    required this.id,
    required this.projectId,
    required this.itemType,
    this.itemRef,
    required this.title,
    required this.quantity,
    required this.expectedUnitPrice,
    required this.expectedTotalPrice,
    required this.actualTotalPrice,
    required this.status,
  });

  PartOutLineModel copyWith({
    String? id,
    String? projectId,
    ItemType? itemType,
    String? itemRef,
    String? title,
    int? quantity,
    double? expectedUnitPrice,
    double? expectedTotalPrice,
    double? actualTotalPrice,
    PartOutLineStatus? status,
  }) {
    return PartOutLineModel(
      id: id ?? this.id,
      projectId: projectId ?? this.projectId,
      itemType: itemType ?? this.itemType,
      itemRef: itemRef ?? this.itemRef,
      title: title ?? this.title,
      quantity: quantity ?? this.quantity,
      expectedUnitPrice: expectedUnitPrice ?? this.expectedUnitPrice,
      expectedTotalPrice: expectedTotalPrice ?? this.expectedTotalPrice,
      actualTotalPrice: actualTotalPrice ?? this.actualTotalPrice,
      status: status ?? this.status,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'projectId': projectId,
      'itemType': itemType.name,
      'itemRef': itemRef,
      'title': title,
      'quantity': quantity,
      'expectedUnitPrice': expectedUnitPrice,
      'expectedTotalPrice': expectedTotalPrice,
      'actualTotalPrice': actualTotalPrice,
      'status': status.name,
    };
  }

  factory PartOutLineModel.fromMap(Map<String, dynamic> map) {
    return PartOutLineModel(
      id: map['id'] as String,
      projectId: map['projectId'] as String,
      itemType: ItemType.values.byName(map['itemType'] as String),
      itemRef: map['itemRef'] as String?,
      title: map['title'] as String,
      quantity: map['quantity'] as int,
      expectedUnitPrice: (map['expectedUnitPrice'] as num).toDouble(),
      expectedTotalPrice: (map['expectedTotalPrice'] as num).toDouble(),
      actualTotalPrice: (map['actualTotalPrice'] as num).toDouble(),
      status: PartOutLineStatus.values.byName(map['status'] as String),
    );
  }
}
