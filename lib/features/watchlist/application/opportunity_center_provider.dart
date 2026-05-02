import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/opportunity_center_entry_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';

final opportunityCenterProvider =
    Provider<List<OpportunityCenterEntryModel>>((ref) {
  final opportunities = ref.watch(watchlistOpportunitiesProvider);
  final targetHit = opportunities.where((e) => e.underDesired).length;
  final underMax = opportunities.where((e) => e.underMax).length;

  return [
    OpportunityCenterEntryModel(
      title: 'Target hits',
      subtitle: '$targetHit items are already under desired price',
      actionKey: 'target_hits',
    ),
    OpportunityCenterEntryModel(
      title: 'Under max price',
      subtitle: '$underMax items are still acceptable buys',
      actionKey: 'under_max',
    ),
    OpportunityCenterEntryModel(
      title: 'Review watchlist',
      subtitle: 'Open active targets and decide what to buy now',
      actionKey: 'open_watchlist',
    ),
  ];
});
