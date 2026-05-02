import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

final globalSearchProvider = Provider<List<GlobalSearchResultModel>>((ref) {
  return const [
    GlobalSearchResultModel(
      id: '1',
      title: 'Ninjago Dragon Set',
      subtitle: 'Inventory',
      type: 'inventory',
      route: '/inventory',
      priorityScore: 920,
    ),
    GlobalSearchResultModel(
      id: '2',
      title: 'Ninjago Minifigure Bundle',
      subtitle: 'Watchlist',
      type: 'watchlist',
      route: '/watchlist',
      priorityScore: 760,
    ),
    GlobalSearchResultModel(
      id: '3',
      title: 'Bricklink Market Snapshot',
      subtitle: 'Market',
      type: 'market',
      route: '/market',
      priorityScore: 610,
    ),
    GlobalSearchResultModel(
      id: '4',
      title: 'Recent Purchase Invoice',
      subtitle: 'Purchases',
      type: 'purchase',
      route: '/purchases',
      priorityScore: 540,
    ),
  ];
});