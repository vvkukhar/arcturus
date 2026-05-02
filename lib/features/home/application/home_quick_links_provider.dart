// lib/features/home/application/home_quick_links_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/home/application/home_quick_link_model.dart';

final homeQuickLinksProvider = Provider<List<HomeQuickLinkModel>>((ref) {
  return const [
    HomeQuickLinkModel(
      title: 'Dashboard',
      subtitle: 'overview and priorities',
      route: AppRouter.dashboard,
    ),
    HomeQuickLinkModel(
      title: 'Inventory',
      subtitle: 'items, filters, actions',
      route: AppRouter.inventory,
    ),
    HomeQuickLinkModel(
      title: 'Global Search',
      subtitle: 'find anything instantly',
      route: AppRouter.globalSearch,
    ),
    HomeQuickLinkModel(
      title: 'Opportunity Center',
      subtitle: 'what is worth buying now',
      route: AppRouter.opportunityCenter,
    ),
    HomeQuickLinkModel(
      title: 'Dead Stock Center',
      subtitle: 'unlock frozen capital',
      route: AppRouter.deadStockCenter,
    ),
    HomeQuickLinkModel(
      title: 'Deal Evaluator',
      subtitle: 'check new deals quickly',
      route: AppRouter.dealEvaluator,
    ),
    HomeQuickLinkModel(
      title: 'Analytics',
      subtitle: 'profit, velocity, pricing',
      route: AppRouter.analytics,
    ),
    HomeQuickLinkModel(
      title: 'Activity Timeline',
      subtitle: 'recent system flow',
      route: AppRouter.activityTimeline,
    ),
  ];
});
