import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_action_recommendation_model.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';

final dashboardActionRecommendationsProvider = Provider<List<DashboardActionRecommendationModel>>((ref) {
  final deadStock = ref.watch(deadStockEntriesProvider);
  final opportunities = ref.watch(watchlistOpportunitiesProvider);

  final result = <DashboardActionRecommendationModel>[];

  if (deadStock.isNotEmpty) {
    result.add(
      DashboardActionRecommendationModel(
        title: 'Reprice dead stock',
        subtitle: '${deadStock.length} items are aging too long',
        severity: 'warning',
      ),
    );
  }

  final underDesired = opportunities.where((e) => e.underDesired).length;
  if (underDesired > 0) {
    result.add(
      DashboardActionRecommendationModel(
        title: 'Buy opportunities available',
        subtitle: '$underDesired watchlist items hit target price',
        severity: 'good',
      ),
    );
  }

  final underMax = opportunities.where((e) => e.underMax).length;
  if (underMax > underDesired) {
    result.add(
      DashboardActionRecommendationModel(
        title: 'Secondary opportunities',
        subtitle: '${underMax - underDesired} more items are under max price',
        severity: 'neutral',
      ),
    );
  }

  if (result.isEmpty) {
    result.add(
      const DashboardActionRecommendationModel(
        title: 'Stable state',
        subtitle: 'No urgent action required right now',
        severity: 'neutral',
      ),
    );
  }

  return result;
});