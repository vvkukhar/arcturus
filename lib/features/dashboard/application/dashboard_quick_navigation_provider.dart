import 'package:flutter_riverpod/flutter_riverpod.dart';

class DashboardQuickNavigationItemModel {
  final String title;
  final String route;
  final String badge;

  const DashboardQuickNavigationItemModel({
    required this.title,
    required this.route,
    required this.badge,
  });
}

final dashboardQuickNavigationProvider =
    Provider<List<DashboardQuickNavigationItemModel>>((ref) {
  return const [
    DashboardQuickNavigationItemModel(
      title: 'Buy Queue',
      route: '/buy-queue',
      badge: 'buy',
    ),
    DashboardQuickNavigationItemModel(
      title: 'Sell Queue',
      route: '/sell-queue',
      badge: 'sell',
    ),
    DashboardQuickNavigationItemModel(
      title: 'Reprice Queue',
      route: '/reprice-queue',
      badge: 'reprice',
    ),
    DashboardQuickNavigationItemModel(
      title: 'Review Queue',
      route: '/review-queue',
      badge: 'review',
    ),
  ];
});
