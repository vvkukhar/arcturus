import 'package:flutter/material.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_quick_navigation_provider.dart';

class DashboardQuickNavigationCard extends StatelessWidget {
  final List<DashboardQuickNavigationItemModel> items;

  const DashboardQuickNavigationCard({
    super.key,
    required this.items,
  });

  Color _color(String badge) {
    switch (badge) {
      case 'buy':
        return Colors.green;
      case 'sell':
        return Colors.blue;
      case 'reprice':
        return Colors.orange;
      case 'review':
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  String _resolveRoute(String route) {
    switch (route) {
      case '/buy-queue':
        return AppRouter.purchaseFlow;
      case '/sell-queue':
        return AppRouter.bestSell;
      case '/reprice-queue':
        return AppRouter.repriceFlow;
      case '/review-queue':
        return AppRouter.reviewFlow;
      default:
        return route;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: items.map((item) {
            final color = _color(item.badge);
            final resolvedRoute = _resolveRoute(item.route);

            return InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () {
                Navigator.of(context).pushNamed(resolvedRoute);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      item.title,
                      style: TextStyle(
                        color: color,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}