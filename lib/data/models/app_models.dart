import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';

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
  final List<dynamic> images;

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
    this.images = const [],
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
        images: images,
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
        images: map['images'] ?? [],
      );
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

  bool get isActive => active;

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
  final double platformFee;
  final double shippingPaidByMe;
  final double shippingPaidByBuyer;
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
    this.platformFee = 0.0,
    this.shippingPaidByMe = 0.0,
    this.shippingPaidByBuyer = 0.0,
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
        platformFee: (map['platformFee'] ?? 0).toDouble(),
        shippingPaidByMe: (map['shippingPaidByMe'] ?? 0).toDouble(),
        shippingPaidByBuyer: (map['shippingPaidByBuyer'] ?? 0).toDouble(),
        createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
        inventoryItem: map['inventoryItem'] != null ? InventoryItemModel.fromMap(Map<String, dynamic>.from(map['inventoryItem'])) : null,
      );
}

class MarketSnapshotModel {
  final String id;
  final String itemId;
  final double medianPrice;
  const MarketSnapshotModel({required this.id, required this.itemId, required this.medianPrice});
  factory MarketSnapshotModel.fromMap(Map<String, dynamic> map) => MarketSnapshotModel(id: map['id'], itemId: map['itemId'], medianPrice: (map['medianPrice'] ?? 0).toDouble());
}

class PartOutProjectModel {
  final String id;
  final String sourceSetTitle;
  final double totalCost;
  final dynamic status;
  const PartOutProjectModel({required this.id, required this.sourceSetTitle, required this.totalCost, required this.status});
  factory PartOutProjectModel.fromMap(Map<String, dynamic> map) => PartOutProjectModel(id: map['id'], sourceSetTitle: map['sourceSetTitle'] ?? 'Project', totalCost: (map['totalCost'] ?? 0).toDouble(), status: map['status']);
  Map<String, dynamic> toMap() => {'id': id};
}

class PartOutLineModel {
  final String id;
  final String projectId;
  final String title;
  final int quantity;
  final double expectedUnitPrice;
  final double expectedTotalPrice;
  final double actualTotalPrice;
  final dynamic status;
  const PartOutLineModel({required this.id, required this.projectId, required this.title, required this.quantity, required this.expectedUnitPrice, required this.expectedTotalPrice, required this.actualTotalPrice, required this.status});
  factory PartOutLineModel.fromMap(Map<String, dynamic> map) => PartOutLineModel(id: map['id'], projectId: map['projectId'], title: map['title'] ?? 'Part', quantity: map['quantity'] ?? 1, expectedUnitPrice: (map['expectedUnitPrice'] ?? 0).toDouble(), expectedTotalPrice: (map['expectedTotalPrice'] ?? 0).toDouble(), actualTotalPrice: (map['actualTotalPrice'] ?? 0).toDouble(), status: map['status']);
  Map<String, dynamic> toMap() => {'id': id};
}