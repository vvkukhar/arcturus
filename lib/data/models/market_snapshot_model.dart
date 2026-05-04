class MarketSnapshotModel {
  final String id;
  final String itemRef;
  final String source;
  final double lowPrice;
  final double averagePrice;
  final double highPrice;
  final String currency;
  final int? sellerCount;
  final int? availableQty;
  final DateTime capturedAt;
  final String? url;

  const MarketSnapshotModel({
    required this.id,
    required this.itemRef,
    required this.source,
    required this.lowPrice,
    required this.averagePrice,
    required this.highPrice,
    required this.currency,
    this.sellerCount,
    this.availableQty,
    required this.capturedAt,
    this.url,
  });

  String get sourcePlatform => source;
  DateTime get recordedAt => capturedAt;
  String? get note => url;

  MarketSnapshotModel copyWith({
    String? id,
    String? itemRef,
    String? source,
    double? lowPrice,
    double? averagePrice,
    double? highPrice,
    String? currency,
    int? sellerCount,
    int? availableQty,
    DateTime? capturedAt,
    String? url,
  }) {
    return MarketSnapshotModel(
      id: id ?? this.id,
      itemRef: itemRef ?? this.itemRef,
      source: source ?? this.source,
      lowPrice: lowPrice ?? this.lowPrice,
      averagePrice: averagePrice ?? this.averagePrice,
      highPrice: highPrice ?? this.highPrice,
      currency: currency ?? this.currency,
      sellerCount: sellerCount ?? this.sellerCount,
      availableQty: availableQty ?? this.availableQty,
      capturedAt: capturedAt ?? this.capturedAt,
      url: url ?? this.url,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'itemRef': itemRef,
      'source': source,
      'lowPrice': lowPrice,
      'averagePrice': averagePrice,
      'highPrice': highPrice,
      'currency': currency,
      'sellerCount': sellerCount,
      'availableQty': availableQty,
      'capturedAt': capturedAt.toIso8601String(),
      'url': url,
    };
  }

  factory MarketSnapshotModel.fromMap(Map<String, dynamic> map) {
    return MarketSnapshotModel(
      id: map['id'] as String,
      itemRef: map['itemRef'] as String,
      source: map['source'] as String,
      lowPrice: (map['lowPrice'] as num).toDouble(),
      averagePrice: (map['averagePrice'] as num).toDouble(),
      highPrice: (map['highPrice'] as num).toDouble(),
      currency: map['currency'] as String,
      sellerCount: map['sellerCount'] as int?,
      availableQty: map['availableQty'] as int?,
      capturedAt: DateTime.parse(map['capturedAt'] as String),
      url: map['url'] as String?,
    );
  }
}