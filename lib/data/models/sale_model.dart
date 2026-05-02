class SaleModel {
  final String id;
  final String itemId;
  final String platform;
  final String? buyerName;
  final double salePrice;
  final double platformFee;
  final double shippingByMe;
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
    required this.shippingByMe,
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

  factory SaleModel.fromJson(Map<String, dynamic> json) {
    return SaleModel(
      id: json['id'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      platform: json['platform'] as String? ?? '',
      buyerName: json['buyerName'] as String?,
      salePrice: (json['salePrice'] as num?)?.toDouble() ?? 0,
      platformFee: (json['platformFee'] as num?)?.toDouble() ?? 0,
      shippingByMe: (json['shippingByMe'] as num?)?.toDouble() ?? 0,
      finalNet: (json['finalNet'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? 'UAH',
      saleDate:
          DateTime.tryParse(json['saleDate'] as String? ?? '') ?? DateTime.now(),
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
      'shippingByMe': shippingByMe,
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
    double? shippingByMe,
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
      shippingByMe: shippingByMe ?? this.shippingByMe,
      finalNet: finalNet ?? this.finalNet,
      currency: currency ?? this.currency,
      saleDate: saleDate ?? this.saleDate,
      note: note ?? this.note,
      quantity: quantity ?? this.quantity,
    );
  }
}