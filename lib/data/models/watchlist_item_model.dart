import 'package:lego_trading_manager/core/enums/item_type.dart';

class WatchlistItemModel {
  final String id;
  final String title;
  final ItemType type;
  final String? theme;
  final String? refId;
  final double desiredBuyPrice;
  final double maxBuyPrice;
  final double? marketPrice;
  final String? comment;
  final DateTime createdAt;
  final bool isActive;

  const WatchlistItemModel({
    required this.id,
    required this.title,
    required this.type,
    this.theme,
    this.refId,
    required this.desiredBuyPrice,
    required this.maxBuyPrice,
    this.marketPrice,
    this.comment,
    required this.createdAt,
    this.isActive = true,
  });

  bool get underDesired => marketPrice != null && marketPrice! <= desiredBuyPrice;
  bool get underMax => marketPrice != null && marketPrice! <= maxBuyPrice;

  WatchlistItemModel copyWith({
    String? id,
    String? title,
    ItemType? type,
    String? theme,
    String? refId,
    double? desiredBuyPrice,
    double? maxBuyPrice,
    double? marketPrice,
    String? comment,
    DateTime? createdAt,
    bool? isActive,
  }) {
    return WatchlistItemModel(
      id: id ?? this.id,
      title: title ?? this.title,
      type: type ?? this.type,
      theme: theme ?? this.theme,
      refId: refId ?? this.refId,
      desiredBuyPrice: desiredBuyPrice ?? this.desiredBuyPrice,
      maxBuyPrice: maxBuyPrice ?? this.maxBuyPrice,
      marketPrice: marketPrice ?? this.marketPrice,
      comment: comment ?? this.comment,
      createdAt: createdAt ?? this.createdAt,
      isActive: isActive ?? this.isActive,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'type': type.name,
      'theme': theme,
      'refId': refId,
      'desiredBuyPrice': desiredBuyPrice,
      'maxBuyPrice': maxBuyPrice,
      'marketPrice': marketPrice,
      'comment': comment,
      'createdAt': createdAt.toIso8601String(),
      'isActive': isActive,
    };
  }

  factory WatchlistItemModel.fromMap(Map<String, dynamic> map) {
    return WatchlistItemModel(
      id: map['id'] as String,
      title: map['title'] as String,
      type: ItemType.values.byName(map['type'] as String),
      theme: map['theme'] as String?,
      refId: map['refId'] as String?,
      desiredBuyPrice: (map['desiredBuyPrice'] as num).toDouble(),
      maxBuyPrice: (map['maxBuyPrice'] as num).toDouble(),
      marketPrice: map['marketPrice'] != null ? (map['marketPrice'] as num).toDouble() : null,
      comment: map['comment'] as String?,
      createdAt: DateTime.parse(map['createdAt'] as String),
      isActive: map['isActive'] as bool? ?? true,
    );
  }
}