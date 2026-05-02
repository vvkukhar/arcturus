// lib/data/models/item_model.dart

import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';

class ItemModel {
  final String id;
  final String title;
  final ItemType type;
  final String? theme;
  final String? subtheme;
  final String? legoNumber;
  final String? minifigId;
  final String? setId;
  final ItemCondition condition;
  final ItemCompleteness completeness;
  final OwnershipType ownershipType;

  final double purchasePrice;
  final double shippingToMe;
  final double extraCosts;
  final double totalCost;

  final double? marketLow;
  final double? marketAverage;
  final double? expectedSalePrice;
  final double? actualSalePrice;

  final String? platformBought;
  final String? platformSold;

  final ItemStatus status;
  final DateTime? purchaseDate;
  final DateTime? saleDate;

  final String? notes;
  final List tags;
  final List photos;
  final bool isTracked;
  final int quantity;

  const ItemModel({
    required this.id,
    required this.title,
    required this.type,
    this.theme,
    this.subtheme,
    this.legoNumber,
    this.minifigId,
    this.setId,
    required this.condition,
    required this.completeness,
    required this.ownershipType,
    required this.purchasePrice,
    required this.shippingToMe,
    required this.extraCosts,
    required this.totalCost,
    this.marketLow,
    this.marketAverage,
    this.expectedSalePrice,
    this.actualSalePrice,
    this.platformBought,
    this.platformSold,
    required this.status,
    this.purchaseDate,
    this.saleDate,
    this.notes,
    this.tags = const [],
    this.photos = const [],
    this.isTracked = true,
    this.quantity = 1,
  });

  ItemModel copyWith({
    String? id,
    String? title,
    ItemType? type,
    String? theme,
    String? subtheme,
    String? legoNumber,
    String? minifigId,
    String? setId,
    ItemCondition? condition,
    ItemCompleteness? completeness,
    OwnershipType? ownershipType,
    double? purchasePrice,
    double? shippingToMe,
    double? extraCosts,
    double? totalCost,
    double? marketLow,
    double? marketAverage,
    double? expectedSalePrice,
    double? actualSalePrice,
    String? platformBought,
    String? platformSold,
    ItemStatus? status,
    DateTime? purchaseDate,
    DateTime? saleDate,
    String? notes,
    List? tags,
    List? photos,
    bool? isTracked,
    int? quantity,
  }) {
    return ItemModel(
      id: id ?? this.id,
      title: title ?? this.title,
      type: type ?? this.type,
      theme: theme ?? this.theme,
      subtheme: subtheme ?? this.subtheme,
      legoNumber: legoNumber ?? this.legoNumber,
      minifigId: minifigId ?? this.minifigId,
      setId: setId ?? this.setId,
      condition: condition ?? this.condition,
      completeness: completeness ?? this.completeness,
      ownershipType: ownershipType ?? this.ownershipType,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      shippingToMe: shippingToMe ?? this.shippingToMe,
      extraCosts: extraCosts ?? this.extraCosts,
      totalCost: totalCost ?? this.totalCost,
      marketLow: marketLow ?? this.marketLow,
      marketAverage: marketAverage ?? this.marketAverage,
      expectedSalePrice: expectedSalePrice ?? this.expectedSalePrice,
      actualSalePrice: actualSalePrice ?? this.actualSalePrice,
      platformBought: platformBought ?? this.platformBought,
      platformSold: platformSold ?? this.platformSold,
      status: status ?? this.status,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      saleDate: saleDate ?? this.saleDate,
      notes: notes ?? this.notes,
      tags: tags ?? this.tags,
      photos: photos ?? this.photos,
      isTracked: isTracked ?? this.isTracked,
      quantity: quantity ?? this.quantity,
    );
  }

  bool get isSold => status == ItemStatus.sold;

  bool get isActive => status != ItemStatus.sold;

  bool get isResale => ownershipType == OwnershipType.resale;

  int? get daysInInventory {
    if (purchaseDate == null) return null;
    final endDate = saleDate ?? DateTime.now();
    return endDate.difference(purchaseDate!).inDays;
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'type': type.name,
      'theme': theme,
      'subtheme': subtheme,
      'legoNumber': legoNumber,
      'minifigId': minifigId,
      'setId': setId,
      'condition': condition.name,
      'completeness': completeness.name,
      'ownershipType': ownershipType.name,
      'purchasePrice': purchasePrice,
      'shippingToMe': shippingToMe,
      'extraCosts': extraCosts,
      'totalCost': totalCost,
      'marketLow': marketLow,
      'marketAverage': marketAverage,
      'expectedSalePrice': expectedSalePrice,
      'actualSalePrice': actualSalePrice,
      'platformBought': platformBought,
      'platformSold': platformSold,
      'status': status.name,
      'purchaseDate': purchaseDate?.toIso8601String(),
      'saleDate': saleDate?.toIso8601String(),
      'notes': notes,
      'tags': tags,
      'photos': photos,
      'isTracked': isTracked,
      'quantity': quantity,
    };
  }

  factory ItemModel.fromMap(Map<String, dynamic> map) {
    return ItemModel(
      id: map['id'] as String,
      title: map['title'] as String,
      type: ItemType.values.byName(map['type'] as String),
      theme: map['theme'] as String?,
      subtheme: map['subtheme'] as String?,
      legoNumber: map['legoNumber'] as String?,
      minifigId: map['minifigId'] as String?,
      setId: map['setId'] as String?,
      condition: ItemCondition.values.byName(map['condition'] as String),
      completeness:
          ItemCompleteness.values.byName(map['completeness'] as String),
      ownershipType:
          OwnershipType.values.byName(map['ownershipType'] as String),
      purchasePrice: (map['purchasePrice'] as num).toDouble(),
      shippingToMe: (map['shippingToMe'] as num).toDouble(),
      extraCosts: (map['extraCosts'] as num).toDouble(),
      totalCost: (map['totalCost'] as num).toDouble(),
      marketLow: map['marketLow'] != null
          ? (map['marketLow'] as num).toDouble()
          : null,
      marketAverage: map['marketAverage'] != null
          ? (map['marketAverage'] as num).toDouble()
          : null,
      expectedSalePrice: map['expectedSalePrice'] != null
          ? (map['expectedSalePrice'] as num).toDouble()
          : null,
      actualSalePrice: map['actualSalePrice'] != null
          ? (map['actualSalePrice'] as num).toDouble()
          : null,
      platformBought: map['platformBought'] as String?,
      platformSold: map['platformSold'] as String?,
      status: ItemStatus.values.byName(map['status'] as String),
      purchaseDate: map['purchaseDate'] != null
          ? DateTime.parse(map['purchaseDate'] as String)
          : null,
      saleDate: map['saleDate'] != null
          ? DateTime.parse(map['saleDate'] as String)
          : null,
      notes: map['notes'] as String?,
      tags: List.from(map['tags'] ?? const []),
      photos: List.from(map['photos'] ?? const []),
      isTracked: map['isTracked'] as bool? ?? true,
      quantity: map['quantity'] as int? ?? 1,
    );
  }
}
