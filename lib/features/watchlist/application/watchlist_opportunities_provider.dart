import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_model.dart';

final watchlistOpportunitiesProvider =
    Provider<List<WatchlistOpportunityModel>>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;
  final opportunities = <WatchlistOpportunityModel>[];

  for (final item in items) {
    if (!item.isActive || item.marketPrice == null) continue;

    final market = item.marketPrice!;
    final underMax = market <= item.maxBuyPrice;
    final underDesired = market <= item.desiredBuyPrice;

    if (!underMax) continue;

    opportunities.add(
      WatchlistOpportunityModel(
        id: item.id,
        title: item.title,
        desiredBuyPrice: item.desiredBuyPrice,
        maxBuyPrice: item.maxBuyPrice,
        marketPrice: market,
        underDesired: underDesired,
        underMax: underMax,
        sourceItem: item, // Тепер можна спокійно діставати sourceItem
      ),
    );
  }

  // Сортуємо: спочатку ті що underDesired, потім по вигоді (maxBuyPrice - marketPrice)
  opportunities.sort((a, b) {
    if (a.underDesired && !b.underDesired) return -1;
    if (!a.underDesired && b.underDesired) return 1;
    
    final aGap = a.maxBuyPrice - a.marketPrice;
    final bGap = b.maxBuyPrice - b.marketPrice;
    return bGap.compareTo(aGap);
  });

  return opportunities;
});