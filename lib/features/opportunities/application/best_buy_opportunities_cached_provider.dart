import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/opportunities/application/best_buy_opportunities_provider.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_cached_repository_provider.dart';

final bestBuyOpportunitiesCachedProvider =
    FutureProvider<List<BestBuyOpportunityModel>>((ref) async {
  final repository = ref.watch(opportunitiesCachedRepositoryProvider);
  final json = await repository.getBestBuyOpportunities();
  return json.map(BestBuyOpportunityModel.fromJson).toList();
});
