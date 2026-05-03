class SaleModel {
  final String id;
  final String itemId;
  final String platform;
  final String? buyerName;
  final double salePrice;
  final double platformFee;
  final double shippingPaidByMe;
  final double shippingPaidByBuyer;
  final double finalNet;
  final String currency;
  final DateTime saleDate;
  final String? note;
  final int quantity;

  const SaleModel({
    required this.id,
    required this.itemId,
    required this.platform,
    this.buyerName,
    required this.salePrice,
    required this.platformFee,
    required this.shippingPaidByMe,
    this.shippingPaidByBuyer = 0.0,
    required this.finalNet,
    required this.currency,
    required this.saleDate,
    this.note,
    this.quantity = 1,
  });

  double get unitNet {
    if (quantity <= 0) return finalNet;
    return finalNet / quantity;
  }

  factory SaleModel.fromMap(Map<String, dynamic> map) {
    return SaleModel.fromJson(map);
  }

  Map<String, dynamic> toMap() => toJson();

  factory SaleModel.fromJson(Map<String, dynamic> json) {
    return SaleModel(
      id: json['id'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      platform: json['platform'] as String? ?? '',
      buyerName: json['buyerName'] as String?,
      salePrice: (json['salePrice'] as num?)?.toDouble() ?? 0.0,
      platformFee: (json['platformFee'] as num?)?.toDouble() ?? 0.0,
      shippingPaidByMe: (json['shippingPaidByMe'] ?? json['shippingByMe'] as num?)?.toDouble() ?? 0.0,
      shippingPaidByBuyer: (json['shippingPaidByBuyer'] as num?)?.toDouble() ?? 0.0,
      finalNet: (json['finalNet'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'UAH',
      saleDate: DateTime.tryParse(json['saleDate'] as String? ?? '') ?? DateTime.now(),
      note: json['note'] as String?,
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemId': itemId,
      'platform': platform,
      'buyerName': buyerName,
      'salePrice': salePrice,
      'platformFee': platformFee,
      'shippingPaidByMe': shippingPaidByMe,
      'shippingPaidByBuyer': shippingPaidByBuyer,
      'finalNet': finalNet,
      'currency': currency,
      'saleDate': saleDate.toIso8601String(),
      'note': note,
      'quantity': quantity,
    };
  }

  SaleModel copyWith({
    String? id,
    String? itemId,
    String? platform,
    String? buyerName,
    double? salePrice,
    double? platformFee,
    double? shippingPaidByMe,
    double? shippingPaidByBuyer,
    double? finalNet,
    String? currency,
    DateTime? saleDate,
    String? note,
    int? quantity,
  }) {
    return SaleModel(
      id: id ?? this.id,
      itemId: itemId ?? this.itemId,
      platform: platform ?? this.platform,
      buyerName: buyerName ?? this.buyerName,
      salePrice: salePrice ?? this.salePrice,
      platformFee: platformFee ?? this.platformFee,
      shippingPaidByMe: shippingPaidByMe ?? this.shippingPaidByMe,
      shippingPaidByBuyer: shippingPaidByBuyer ?? this.shippingPaidByBuyer,
      finalNet: finalNet ?? this.finalNet,
      currency: currency ?? this.currency,
      saleDate: saleDate ?? this.saleDate,
      note: note ?? this.note,
      quantity: quantity ?? this.quantity,
    );
  }
}