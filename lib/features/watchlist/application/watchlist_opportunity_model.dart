import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistOpportunityModel {
  final String id;
  final String title;
  final double desiredBuyPrice;
  final double maxBuyPrice;
  final double marketPrice;
  final bool underDesired;
  final bool underMax;
  final WatchlistItemModel sourceItem;

  const WatchlistOpportunityModel({
    required this.id,
    required this.title,
    required this.desiredBuyPrice,
    required this.maxBuyPrice,
    required this.marketPrice,
    required this.underDesired,
    required this.underMax,
    required this.sourceItem,
  });
}