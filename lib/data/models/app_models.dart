import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';

class CatalogItemModel {
  final String id;
  final String title;
  final ItemType kind;
  final String? setNumber;
  final String? theme;
  final String? imageUrl;

  const CatalogItemModel({
    required this.id,
    required this.title,
    required this.kind,
    this.setNumber,
    this.theme,
    this.imageUrl,
  });

  factory CatalogItemModel.fromMap(Map<String, dynamic> map) => CatalogItemModel(
        id: map['id'],
        title: map['title'],
        kind: ItemType.values.firstWhere((e) => e.name == map['kind'], orElse: () => ItemType.set),
        setNumber: map['setNumber'],
        theme: map['theme'],
        imageUrl: map['imageUrl'],
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'title': title,
        'kind': kind.name,
        'setNumber': setNumber,
        'theme': theme,
        'imageUrl': imageUrl,
      };
}

class InventoryItemModel {
  final String id;
  final String itemId;
  final String titleSnapshot;
  final double purchasePrice;
  final double totalCost;
  final int quantity;
  final ItemCondition condition;
  final bool sealed;
  final double? expectedSalePriceManual;
  final String? source;
  final String? storageLocationId;
  final String? warehouseId;
  final String? assignedUserId;
  final ItemStatus status;
  final DateTime createdAt;
  final CatalogItemModel? item;

  const InventoryItemModel({
    required this.id,
    required this.itemId,
    required this.titleSnapshot,
    required this.purchasePrice,
    required this.totalCost,
    required this.quantity,
    required this.condition,
    required this.sealed,
    this.expectedSalePriceManual,
    this.source,
    this.storageLocationId,
    this.warehouseId,
    this.assignedUserId,
    required this.status,
    required this.createdAt,
    this.item,
  });

  bool get isActive => quantity > 0 && status != ItemStatus.sold && status != ItemStatus.archived;

  InventoryItemModel copyWith({
    double? expectedSalePriceManual,
    int? quantity,
    ItemStatus? status,
  }) =>
      InventoryItemModel(
        id: id,
        itemId: itemId,
        titleSnapshot: titleSnapshot,
        purchasePrice: purchasePrice,
        totalCost: totalCost,
        quantity: quantity ?? this.quantity,
        condition: condition,
        sealed: sealed,
        expectedSalePriceManual: expectedSalePriceManual ?? this.expectedSalePriceManual,
        source: source,
        storageLocationId: storageLocationId,
        warehouseId: warehouseId,
        assignedUserId: assignedUserId,
        status: status ?? this.status,
        createdAt: createdAt,
        item: item,
      );

  factory InventoryItemModel.fromMap(Map<String, dynamic> map) => InventoryItemModel(
        id: map['id'],
        itemId: map['itemId'],
        titleSnapshot: map['titleSnapshot'],
        purchasePrice: (map['purchasePrice'] ?? 0).toDouble(),
        totalCost: (map['totalCost'] ?? 0).toDouble(),
        quantity: map['quantity'] ?? 1,
        condition: ItemCondition.values.firstWhere((e) => e.name == map['condition'], orElse: () => ItemCondition.usedGood),
        sealed: map['sealed'] ?? false,
        expectedSalePriceManual: map['expectedSalePriceManual']?.toDouble(),
        source: map['source'],
        storageLocationId: map['storageLocationId'],
        warehouseId: map['warehouseId'],
        assignedUserId: map['assignedUserId'],
        status: ItemStatus.values.firstWhere((e) => e.name == map['status'], orElse: () => ItemStatus.purchased),
        createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
        item: map['item'] != null ? CatalogItemModel.fromMap(Map<String, dynamic>.from(map['item'])) : null,
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'itemId': itemId,
        'titleSnapshot': titleSnapshot,
        'purchasePrice': purchasePrice,
        'totalCost': totalCost,
        'quantity': quantity,
        'condition': condition.name,
        'sealed': sealed,
        'expectedSalePriceManual': expectedSalePriceManual,
        'source': source,
        'storageLocationId': storageLocationId,
        'warehouseId': warehouseId,
        'assignedUserId': assignedUserId,
        'status': status.name,
      };
}

class WatchlistItemModel {
  final String id;
  final String itemId;
  final String titleSnapshot;
  final double desiredBuyPrice;
  final double maxBuyPrice;
  final double? targetSellPrice;
  final bool active;
  final int priority;
  final CatalogItemModel? item;

  const WatchlistItemModel({
    required this.id,
    required this.itemId,
    required this.titleSnapshot,
    required this.desiredBuyPrice,
    required this.maxBuyPrice,
    this.targetSellPrice,
    required this.active,
    required this.priority,
    this.item,
  });

  factory WatchlistItemModel.fromMap(Map<String, dynamic> map) => WatchlistItemModel(
        id: map['id'],
        itemId: map['itemId'],
        titleSnapshot: map['titleSnapshot'],
        desiredBuyPrice: (map['desiredBuyPrice'] ?? 0).toDouble(),
        maxBuyPrice: (map['maxBuyPrice'] ?? 0).toDouble(),
        targetSellPrice: map['targetSellPrice']?.toDouble(),
        active: map['active'] ?? true,
        priority: map['priority'] ?? 50,
        item: map['item'] != null ? CatalogItemModel.fromMap(Map<String, dynamic>.from(map['item'])) : null,
      );
}

class SaleModel {
  final String id;
  final String inventoryItemId;
  final String itemId;
  final double sellPrice;
  final double costBasis;
  final double profit;
  final double roiPercent;
  final String channel;
  final int quantity;
  final DateTime createdAt;
  final InventoryItemModel? inventoryItem;

  const SaleModel({
    required this.id,
    required this.inventoryItemId,
    required this.itemId,
    required this.sellPrice,
    required this.costBasis,
    required this.profit,
    required this.roiPercent,
    required this.channel,
    required this.quantity,
    required this.createdAt,
    this.inventoryItem,
  });

  factory SaleModel.fromMap(Map<String, dynamic> map) => SaleModel(
        id: map['id'],
        inventoryItemId: map['inventoryItemId'],
        itemId: map['itemId'],
        sellPrice: (map['sellPrice'] ?? 0).toDouble(),
        costBasis: (map['costBasis'] ?? 0).toDouble(),
        profit: (map['profit'] ?? 0).toDouble(),
        roiPercent: (map['roiPercent'] ?? 0).toDouble(),
        channel: map['channel'] ?? 'Unknown',
        quantity: map['quantity'] ?? 1,
        createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
        inventoryItem: map['inventoryItem'] != null ? InventoryItemModel.fromMap(Map<String, dynamic>.from(map['inventoryItem'])) : null,
      );
}