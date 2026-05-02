import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/presentation/analytics_screen.dart';
import 'package:lego_trading_manager/features/command_center/presentation/command_center_screen.dart';
import 'package:lego_trading_manager/features/conflicts/presentation/conflict_queue_screen.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_live_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_evaluator_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_history_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/purchase_flow_history_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/purchase_flow_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/reprice_flow_history_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/reprice_flow_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/review_flow_history_screen.dart';
import 'package:lego_trading_manager/features/flows/presentation/review_flow_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_live_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_screen.dart';
import 'package:lego_trading_manager/features/operator/presentation/operator_unresolved_matches_screen.dart';
import 'package:lego_trading_manager/features/operator/presentation/source_run_history_screen.dart';
import 'package:lego_trading_manager/features/operator/presentation/sync_error_log_screen.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/best_buy_opportunities_screen.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/best_reprice_opportunities_screen.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/best_review_opportunities_screen.dart';
import 'package:lego_trading_manager/features/opportunities/presentation/best_sell_opportunities_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchases_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sales_screen.dart';
import 'package:lego_trading_manager/features/search/presentation/global_search_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_screen.dart';
import 'package:lego_trading_manager/features/source_health/presentation/source_health_details_screen.dart';
import 'package:lego_trading_manager/features/sync/presentation/manual_sync_queue_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/opportunity_center_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_live_screen.dart';

class AppRouter {
  static const home = '/';
  static const dashboard = '/dashboard';
  static const watchlist = '/watchlist';
  static const inventory = '/inventory';
  static const market = '/market';
  static const purchases = '/purchases';
  static const sales = '/sales';
  static const analytics = '/analytics';
  static const settings = '/settings';
  static const globalSearch = '/global-search';

  static const purchaseFlow = '/purchase-flow';
  static const repriceFlow = '/reprice-flow';
  static const reviewFlow = '/review-flow';
  static const purchaseFlowHistory = '/purchase-flow-history';
  static const repriceFlowHistory = '/reprice-flow-history';
  static const reviewFlowHistory = '/review-flow-history';

  static const bestBuy = '/best-buy';
  static const bestSell = '/best-sell';
  static const bestReprice = '/best-reprice';
  static const bestReview = '/best-review';

  static const unresolvedMatches = '/unresolved-matches';
  static const sourceRuns = '/source-runs';
  static const syncErrors = '/sync-errors';
  static const sourceHealthDetails = '/source-health-details';
  static const manualSyncQueue = '/manual-sync-queue';
  static const conflictQueue = '/conflict-queue';

  static const opportunityCenter = '/opportunity-center';
  static const deadStockCenter = '/dead-stock-center';
  static const inventoryActionCenter = '/inventory-action-center';
  static const dealEvaluator = '/deal-evaluator';
  static const dealHistory = '/deal-history';
  static const commandCenter = '/command-center';
  static const activityLog = '/activity-log';
  static const activityTimeline = '/activity-timeline';
  static const marketNotesCenter = '/market-notes-center';

  static const addItem = '/add-item';
  static const addPurchase = '/add-purchase';
  static const addSale = '/add-sale';

  static const export = '/export';
  static const importRestore = '/import-restore';
  static const backupHistory = '/backup-history';
  static const systemHealth = '/system-health';
  static const manualActionReports = '/manual-action-reports';

  static const currencyHub = '/currency-hub';
  static const currencyRates = '/currency-rates';
  static const currencyConverter = '/currency-converter';
  static const manualRates = '/manual-rates';
  static const currencyHistory = '/currency-history';
  static const currencySettings = '/currency-settings';
  static const defaultFees = '/default-fees';
  static const backupAutomation = '/backup-automation';
  static const themeSettings = '/theme-settings';
  static const resetData = '/reset-data';

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    final routeName = routeSettings.name;

    if (routeName == home || routeName == dashboard) {
      return MaterialPageRoute(builder: (_) => const DashboardLiveScreen());
    }
    if (routeName == watchlist) {
      return MaterialPageRoute(builder: (_) => const WatchlistLiveScreen());
    }
    if (routeName == inventory) {
      return MaterialPageRoute(builder: (_) => const InventoryLiveScreen());
    }
    if (routeName == market) {
      return MaterialPageRoute(builder: (_) => const MarketScreen());
    }
    if (routeName == purchases) {
      return MaterialPageRoute(builder: (_) => const PurchasesScreen());
    }
    if (routeName == sales) {
      return MaterialPageRoute(builder: (_) => const SalesScreen());
    }
    if (routeName == analytics) {
      return MaterialPageRoute(builder: (_) => const AnalyticsScreen());
    }
    if (routeName == settings) {
      return MaterialPageRoute(builder: (_) => const SettingsScreen());
    }
    if (routeName == globalSearch) {
      return MaterialPageRoute(builder: (_) => const GlobalSearchScreen());
    }
    if (routeName == purchaseFlow) {
      return MaterialPageRoute(builder: (_) => const PurchaseFlowScreen());
    }
    if (routeName == repriceFlow) {
      return MaterialPageRoute(builder: (_) => const RepriceFlowScreen());
    }
    if (routeName == reviewFlow) {
      return MaterialPageRoute(builder: (_) => const ReviewFlowScreen());
    }
    if (routeName == purchaseFlowHistory) {
      return MaterialPageRoute(
        builder: (_) => const PurchaseFlowHistoryScreen(),
      );
    }
    if (routeName == repriceFlowHistory) {
      return MaterialPageRoute(
        builder: (_) => const RepriceFlowHistoryScreen(),
      );
    }
    if (routeName == reviewFlowHistory) {
      return MaterialPageRoute(
        builder: (_) => const ReviewFlowHistoryScreen(),
      );
    }
    if (routeName == bestBuy) {
      return MaterialPageRoute(
        builder: (_) => const BestBuyOpportunitiesScreen(),
      );
    }
    if (routeName == bestSell) {
      return MaterialPageRoute(
        builder: (_) => const BestSellOpportunitiesScreen(),
      );
    }
    if (routeName == bestReprice) {
      return MaterialPageRoute(
        builder: (_) => const BestRepriceOpportunitiesScreen(),
      );
    }
    if (routeName == bestReview) {
      return MaterialPageRoute(
        builder: (_) => const BestReviewOpportunitiesScreen(),
      );
    }
    if (routeName == unresolvedMatches) {
      return MaterialPageRoute(
        builder: (_) => const OperatorUnresolvedMatchesScreen(),
      );
    }
    if (routeName == sourceRuns) {
      return MaterialPageRoute(
        builder: (_) => const SourceRunHistoryScreen(),
      );
    }
    if (routeName == syncErrors) {
      return MaterialPageRoute(
        builder: (_) => const SyncErrorLogScreen(),
      );
    }
    if (routeName == sourceHealthDetails) {
      return MaterialPageRoute(
        builder: (_) => const SourceHealthDetailsScreen(),
      );
    }
    if (routeName == manualSyncQueue) {
      return MaterialPageRoute(
        builder: (_) => const ManualSyncQueueScreen(),
      );
    }
    if (routeName == conflictQueue) {
      return MaterialPageRoute(
        builder: (_) => const ConflictQueueScreen(),
      );
    }
    if (routeName == opportunityCenter) {
      return MaterialPageRoute(
        builder: (_) => const OpportunityCenterScreen(),
      );
    }
    if (routeName == dealEvaluator) {
      return MaterialPageRoute(
        builder: (_) => const DealEvaluatorScreen(),
      );
    }
    if (routeName == dealHistory) {
      return MaterialPageRoute(
        builder: (_) => const DealHistoryScreen(),
      );
    }
    if (routeName == commandCenter) {
      return MaterialPageRoute(
        builder: (_) => const CommandCenterScreen(),
      );
    }

    return MaterialPageRoute(builder: (_) => const DashboardLiveScreen());
  }
}