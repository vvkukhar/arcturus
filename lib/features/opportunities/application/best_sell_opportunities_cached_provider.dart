import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_sell_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_cached_repository_provider.dart';

final bestSellOpportunitiesCachedProvider =
    FutureProvider<List<BestSellOpportunityModel>>((ref) async {
  final repository = ref.watch(opportunitiesCachedRepositoryProvider);
  final json = await repository.getBestSellOpportunities();
  return json.map(BestSellOpportunityModel.fromJson).toList();
});
