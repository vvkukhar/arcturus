import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_cached_repository_provider.dart';

class RemoteWatchlistItemModel {
  final String id;
  final String itemId;
  final String title;
  final double? targetSellPrice;

  const RemoteWatchlistItemModel({
    required this.id,
    required this.itemId,
    required this.title,
    required this.targetSellPrice,
  });

  factory RemoteWatchlistItemModel.fromJson(Map<String, dynamic> json) {
    return RemoteWatchlistItemModel(
      id: json['id'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      targetSellPrice: (json['targetSellPrice'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemId': itemId,
      'title': title,
      'targetSellPrice': targetSellPrice,
    };
  }
}

final watchlistProvider = FutureProvider<List<RemoteWatchlistItemModel>>(
  (ref) async {
    final repo = ref.watch(watchlistCachedRepositoryProvider);
    final json = await repo.getWatchlist();

    return json.map(RemoteWatchlistItemModel.fromJson).toList();
  },
);