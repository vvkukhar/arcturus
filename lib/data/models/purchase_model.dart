import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';

class PurchaseModel {
  final String id;
  final String itemId;
  final String source;
  final String? sourceUrl;
  final String? sellerName;
  final String? sellerContact;
  final double purchasePrice;
  final double shippingCost;
  final double additionalCosts;
  final double finalTotal;
  final String currency;
  final double exchangeRate;
  final PurchasePaymentMethod paymentMethod;
  final DateTime purchaseDate;
  final String? note;
  final int quantity;
  final int soldQuantity;

  const PurchaseModel({
    required this.id,
    required this.itemId,
    required this.source,
    this.sourceUrl,
    this.sellerName,
    this.sellerContact,
    required this.purchasePrice,
    required this.shippingCost,
    required this.additionalCosts,
    required this.finalTotal,
    required this.currency,
    required this.exchangeRate,
    required this.paymentMethod,
    required this.purchaseDate,
    this.note,
    this.quantity = 1,
    this.soldQuantity = 0,
  });

  int get remainingQuantity {
    final remaining = quantity - soldQuantity;
    return remaining < 0 ? 0 : remaining;
  }

  bool get isFullySold => remainingQuantity <= 0;

  double get unitCost {
    if (quantity <= 0) return finalTotal;
    return finalTotal / quantity;
  }

  factory PurchaseModel.fromJson(Map<String, dynamic> json) {
    return PurchaseModel(
      id: json['id'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      source: json['source'] as String? ?? '',
      sourceUrl: json['sourceUrl'] as String?,
      sellerName: json['sellerName'] as String?,
      sellerContact: json['sellerContact'] as String?,
      purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? 0,
      shippingCost: (json['shippingCost'] as num?)?.toDouble() ?? 0,
      additionalCosts: (json['additionalCosts'] as num?)?.toDouble() ?? 0,
      finalTotal: (json['finalTotal'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? 'UAH',
      exchangeRate: (json['exchangeRate'] as num?)?.toDouble() ?? 1,
      paymentMethod: PurchasePaymentMethod.values.firstWhere(
        (method) => method.name == json['paymentMethod'],
        orElse: () => PurchasePaymentMethod.cash,
      ),
      purchaseDate: DateTime.tryParse(json['purchaseDate'] as String? ?? '') ??
          DateTime.now(),
      note: json['note'] as String?,
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      soldQuantity: (json['soldQuantity'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemId': itemId,
      'source': source,
      'sourceUrl': sourceUrl,
      'sellerName': sellerName,
      'sellerContact': sellerContact,
      'purchasePrice': purchasePrice,
      'shippingCost': shippingCost,
      'additionalCosts': additionalCosts,
      'finalTotal': finalTotal,
      'currency': currency,
      'exchangeRate': exchangeRate,
      'paymentMethod': paymentMethod.name,
      'purchaseDate': purchaseDate.toIso8601String(),
      'note': note,
      'quantity': quantity,
      'soldQuantity': soldQuantity,
    };
  }

  PurchaseModel copyWith({
    String? id,
    String? itemId,
    String? source,
    String? sourceUrl,
    String? sellerName,
    String? sellerContact,
    double? purchasePrice,
    double? shippingCost,
    double? additionalCosts,
    double? finalTotal,
    String? currency,
    double? exchangeRate,
    PurchasePaymentMethod? paymentMethod,
    DateTime? purchaseDate,
    String? note,
    int? quantity,
    int? soldQuantity,
  }) {
    return PurchaseModel(
      id: id ?? this.id,
      itemId: itemId ?? this.itemId,
      source: source ?? this.source,
      sourceUrl: sourceUrl ?? this.sourceUrl,
      sellerName: sellerName ?? this.sellerName,
      sellerContact: sellerContact ?? this.sellerContact,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      shippingCost: shippingCost ?? this.shippingCost,
      additionalCosts: additionalCosts ?? this.additionalCosts,
      finalTotal: finalTotal ?? this.finalTotal,
      currency: currency ?? this.currency,
      exchangeRate: exchangeRate ?? this.exchangeRate,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      note: note ?? this.note,
      quantity: quantity ?? this.quantity,
      soldQuantity: soldQuantity ?? this.soldQuantity,
    );
  }
}