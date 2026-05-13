import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/core/enums/partout_project_status.dart';
import 'package:lego_trading_manager/core/enums/partout_line_status.dart';

class ItemModel {
  final String id, title;
  final ItemType type;
  final String? theme, setId, notes;
  final ItemCondition condition;
  final ItemCompleteness completeness;
  final OwnershipType ownershipType;
  final double purchasePrice, shippingToMe, extraCosts, totalCost;
  final double? marketAverage, expectedSalePrice, actualSalePrice;
  final ItemStatus status;
  final DateTime? purchaseDate, saleDate;
  final bool isTracked;
  final int quantity;

  const ItemModel({required this.id, required this.title, required this.type, this.theme, this.setId, this.notes, required this.condition, required this.completeness, required this.ownershipType, required this.purchasePrice, required this.shippingToMe, required this.extraCosts, required this.totalCost, this.marketAverage, this.expectedSalePrice, this.actualSalePrice, required this.status, this.purchaseDate, this.saleDate, required this.isTracked, required this.quantity});

  int? get daysInInventory => purchaseDate != null ? DateTime.now().difference(purchaseDate!).inDays : null;
  bool get isActive => status != ItemStatus.sold && status != ItemStatus.archived;
  bool get isSold => status == ItemStatus.sold;

  ItemModel copyWith({ItemStatus? status, double? expectedSalePrice, int? quantity}) => ItemModel(id: id, title: title, type: type, theme: theme, setId: setId, notes: notes, condition: condition, completeness: completeness, ownershipType: ownershipType, purchasePrice: purchasePrice, shippingToMe: shippingToMe, extraCosts: extraCosts, totalCost: totalCost, marketAverage: marketAverage, expectedSalePrice: expectedSalePrice ?? this.expectedSalePrice, actualSalePrice: actualSalePrice, status: status ?? this.status, purchaseDate: purchaseDate, saleDate: saleDate, isTracked: isTracked, quantity: quantity ?? this.quantity);

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'type': type.name, 'theme': theme, 'setId': setId, 'notes': notes, 'condition': condition.name, 'completeness': completeness.name, 'ownershipType': ownershipType.name, 'purchasePrice': purchasePrice, 'shippingToMe': shippingToMe, 'extraCosts': extraCosts, 'totalCost': totalCost, 'marketAverage': marketAverage, 'expectedSalePrice': expectedSalePrice, 'actualSalePrice': actualSalePrice, 'status': status.name, 'purchaseDate': purchaseDate?.toIso8601String(), 'saleDate': saleDate?.toIso8601String(), 'isTracked': isTracked, 'quantity': quantity};

  factory ItemModel.fromMap(Map<String, dynamic> map) => ItemModel(id: map['id'], title: map['title'], type: ItemType.values.firstWhere((e) => e.name == map['type'], orElse: () => ItemType.set), theme: map['theme'], setId: map['setId'], notes: map['notes'], condition: ItemCondition.values.firstWhere((e) => e.name == map['condition'], orElse: () => ItemCondition.newSealed), completeness: ItemCompleteness.values.firstWhere((e) => e.name == map['completeness'], orElse: () => ItemCompleteness.complete), ownershipType: OwnershipType.values.firstWhere((e) => e.name == map['ownershipType'], orElse: () => OwnershipType.resale), purchasePrice: (map['purchasePrice'] ?? 0).toDouble(), shippingToMe: (map['shippingToMe'] ?? 0).toDouble(), extraCosts: (map['extraCosts'] ?? 0).toDouble(), totalCost: (map['totalCost'] ?? 0).toDouble(), marketAverage: map['marketAverage']?.toDouble(), expectedSalePrice: map['expectedSalePrice']?.toDouble(), actualSalePrice: map['actualSalePrice']?.toDouble(), status: ItemStatus.values.firstWhere((e) => e.name == map['status'], orElse: () => ItemStatus.purchased), purchaseDate: map['purchaseDate'] != null ? DateTime.tryParse(map['purchaseDate']) : null, saleDate: map['saleDate'] != null ? DateTime.tryParse(map['saleDate']) : null, isTracked: map['isTracked'] ?? true, quantity: map['quantity'] ?? 1);
}

class PurchaseModel {
  final String id, itemId, source;
  final String? sourceUrl, sellerName, sellerContact, note;
  final double purchasePrice, shippingCost, additionalCosts, finalTotal, exchangeRate;
  final String currency;
  final PurchasePaymentMethod paymentMethod;
  final DateTime purchaseDate;
  final int quantity, soldQuantity;

  const PurchaseModel({required this.id, required this.itemId, required this.source, this.sourceUrl, this.sellerName, this.sellerContact, this.note, required this.purchasePrice, required this.shippingCost, required this.additionalCosts, required this.finalTotal, required this.exchangeRate, required this.currency, required this.paymentMethod, required this.purchaseDate, required this.quantity, required this.soldQuantity});

  PurchaseModel copyWith({int? soldQuantity}) => PurchaseModel(id: id, itemId: itemId, source: source, sourceUrl: sourceUrl, sellerName: sellerName, sellerContact: sellerContact, note: note, purchasePrice: purchasePrice, shippingCost: shippingCost, additionalCosts: additionalCosts, finalTotal: finalTotal, exchangeRate: exchangeRate, currency: currency, paymentMethod: paymentMethod, purchaseDate: purchaseDate, quantity: quantity, soldQuantity: soldQuantity ?? this.soldQuantity);

  Map<String, dynamic> toJson() => {'id': id, 'itemId': itemId, 'source': source, 'sourceUrl': sourceUrl, 'sellerName': sellerName, 'sellerContact': sellerContact, 'note': note, 'purchasePrice': purchasePrice, 'shippingCost': shippingCost, 'additionalCosts': additionalCosts, 'finalTotal': finalTotal, 'exchangeRate': exchangeRate, currency: currency, 'paymentMethod': paymentMethod.name, 'purchaseDate': purchaseDate.toIso8601String(), 'quantity': quantity, 'soldQuantity': soldQuantity};

  factory PurchaseModel.fromJson(Map<String, dynamic> map) => PurchaseModel(id: map['id'], itemId: map['itemId'], source: map['source'], sourceUrl: map['sourceUrl'], sellerName: map['sellerName'], sellerContact: map['sellerContact'], note: map['note'], purchasePrice: (map['purchasePrice'] ?? 0).toDouble(), shippingCost: (map['shippingCost'] ?? 0).toDouble(), additionalCosts: (map['additionalCosts'] ?? 0).toDouble(), finalTotal: (map['finalTotal'] ?? 0).toDouble(), exchangeRate: (map['exchangeRate'] ?? 1).toDouble(), currency: map['currency'] ?? 'UAH', paymentMethod: PurchasePaymentMethod.values.firstWhere((e) => e.name == map['paymentMethod'], orElse: () => PurchasePaymentMethod.card), purchaseDate: DateTime.tryParse(map['purchaseDate'] ?? '') ?? DateTime.now(), quantity: map['quantity'] ?? 1, soldQuantity: map['soldQuantity'] ?? 0);
}

class SaleModel {
  final String id, itemId, platform;
  final String? buyerName, note;
  final double salePrice, platformFee, shippingPaidByMe, shippingPaidByBuyer, finalNet;
  final String currency;
  final DateTime saleDate;
  final int quantity;

  const SaleModel({required this.id, required this.itemId, required this.platform, this.buyerName, this.note, required this.salePrice, required this.platformFee, required this.shippingPaidByMe, required this.shippingPaidByBuyer, required this.finalNet, required this.currency, required this.saleDate, required this.quantity});

  SaleModel copyWith({String? platform}) => SaleModel(id: id, itemId: itemId, platform: platform ?? this.platform, buyerName: buyerName, note: note, salePrice: salePrice, platformFee: platformFee, shippingPaidByMe: shippingPaidByMe, shippingPaidByBuyer: shippingPaidByBuyer, finalNet: finalNet, currency: currency, saleDate: saleDate, quantity: quantity);

  Map<String, dynamic> toJson() => {'id': id, 'itemId': itemId, 'platform': platform, 'buyerName': buyerName, 'note': note, 'salePrice': salePrice, 'platformFee': platformFee, 'shippingPaidByMe': shippingPaidByMe, 'shippingPaidByBuyer': shippingPaidByBuyer, 'finalNet': finalNet, 'currency': currency, 'saleDate': saleDate.toIso8601String(), 'quantity': quantity};

  factory SaleModel.fromJson(Map<String, dynamic> map) => SaleModel(id: map['id'], itemId: map['itemId'], platform: map['platform'], buyerName: map['buyerName'], note: map['note'], salePrice: (map['salePrice'] ?? 0).toDouble(), platformFee: (map['platformFee'] ?? 0).toDouble(), shippingPaidByMe: (map['shippingPaidByMe'] ?? 0).toDouble(), shippingPaidByBuyer: (map['shippingPaidByBuyer'] ?? 0).toDouble(), finalNet: (map['finalNet'] ?? 0).toDouble(), currency: map['currency'] ?? 'UAH', saleDate: DateTime.tryParse(map['saleDate'] ?? '') ?? DateTime.now(), quantity: map['quantity'] ?? 1);
}

class WatchlistItemModel {
  final String id, title;
  final ItemType type;
  final String? theme, refId, comment;
  final double desiredBuyPrice, maxBuyPrice;
  final double? marketPrice;
  final bool isActive;
  final DateTime createdAt;

  const WatchlistItemModel({required this.id, required this.title, required this.type, this.theme, this.refId, this.comment, required this.desiredBuyPrice, required this.maxBuyPrice, this.marketPrice, required this.isActive, required this.createdAt});

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'type': type.name, 'theme': theme, 'refId': refId, 'comment': comment, 'desiredBuyPrice': desiredBuyPrice, 'maxBuyPrice': maxBuyPrice, 'marketPrice': marketPrice, 'isActive': isActive, 'createdAt': createdAt.toIso8601String()};

  factory WatchlistItemModel.fromMap(Map<String, dynamic> map) => WatchlistItemModel(id: map['id'], title: map['title'], type: ItemType.values.firstWhere((e) => e.name == map['type'], orElse: () => ItemType.set), theme: map['theme'], refId: map['refId'], comment: map['comment'], desiredBuyPrice: (map['desiredBuyPrice'] ?? 0).toDouble(), maxBuyPrice: (map['maxBuyPrice'] ?? 0).toDouble(), marketPrice: map['marketPrice']?.toDouble(), isActive: map['isActive'] ?? true, createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now());
}

class MarketSnapshotModel {
  final String id, itemRef, source;
  final double lowPrice, averagePrice, highPrice;
  final String currency;
  final int? sellerCount, availableQty;
  final String? url;
  final DateTime capturedAt;

  const MarketSnapshotModel({required this.id, required this.itemRef, required this.source, required this.lowPrice, required this.averagePrice, required this.highPrice, required this.currency, this.sellerCount, this.availableQty, this.url, required this.capturedAt});

  Map<String, dynamic> toMap() => {'id': id, 'itemRef': itemRef, 'source': source, 'lowPrice': lowPrice, 'averagePrice': averagePrice, 'highPrice': highPrice, 'currency': currency, 'sellerCount': sellerCount, 'availableQty': availableQty, 'url': url, 'capturedAt': capturedAt.toIso8601String()};

  factory MarketSnapshotModel.fromMap(Map<String, dynamic> map) => MarketSnapshotModel(id: map['id'], itemRef: map['itemRef'], source: map['source'], lowPrice: (map['lowPrice'] ?? 0).toDouble(), averagePrice: (map['averagePrice'] ?? 0).toDouble(), highPrice: (map['highPrice'] ?? 0).toDouble(), currency: map['currency'] ?? 'UAH', sellerCount: map['sellerCount'], availableQty: map['availableQty'], url: map['url'], capturedAt: DateTime.tryParse(map['capturedAt'] ?? '') ?? DateTime.now());
}

class PartOutProjectModel {
  final String id, sourceSetTitle;
  final PartOutProjectStatus status;
  final double totalCost;

  const PartOutProjectModel({required this.id, required this.sourceSetTitle, required this.status, required this.totalCost});

  Map<String, dynamic> toMap() => {'id': id, 'sourceSetTitle': sourceSetTitle, 'status': status.name, 'totalCost': totalCost};

  factory PartOutProjectModel.fromMap(Map<String, dynamic> map) => PartOutProjectModel(id: map['id'], sourceSetTitle: map['sourceSetTitle'], status: PartOutProjectStatus.values.firstWhere((e) => e.name == map['status'], orElse: () => PartOutProjectStatus.active), totalCost: (map['totalCost'] ?? 0).toDouble());
}

class PartOutLineModel {
  final String id, projectId, title;
  final int quantity;
  final double expectedUnitPrice, expectedTotalPrice, actualTotalPrice;
  final PartOutLineStatus status;

  const PartOutLineModel({required this.id, required this.projectId, required this.title, required this.quantity, required this.expectedUnitPrice, required this.expectedTotalPrice, required this.actualTotalPrice, required this.status});

  Map<String, dynamic> toMap() => {'id': id, 'projectId': projectId, 'title': title, 'quantity': quantity, 'expectedUnitPrice': expectedUnitPrice, 'expectedTotalPrice': expectedTotalPrice, 'actualTotalPrice': actualTotalPrice, 'status': status.name};

  factory PartOutLineModel.fromMap(Map<String, dynamic> map) => PartOutLineModel(id: map['id'], projectId: map['projectId'], title: map['title'], quantity: map['quantity'] ?? 1, expectedUnitPrice: (map['expectedUnitPrice'] ?? 0).toDouble(), expectedTotalPrice: (map['expectedTotalPrice'] ?? 0).toDouble(), actualTotalPrice: (map['actualTotalPrice'] ?? 0).toDouble(), status: PartOutLineStatus.values.firstWhere((e) => e.name == map['status'], orElse: () => PartOutLineStatus.planned));
}