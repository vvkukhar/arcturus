import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  void _open(BuildContext context, String route) {
    Navigator.of(context).pop();
    Navigator.of(context).pushNamed(route);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Drawer(
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.inventory_2_outlined, size: 42),
                  const SizedBox(height: 12),
                  Text(i18n.t('drawer.title'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 4),
                  Text(i18n.t('drawer.subtitle'), style: const TextStyle(color: Colors.white70)),
                ],
              ),
            ),
            ListTile(leading: const Icon(Icons.point_of_sale), title: Text(i18n.t('cc.pos')), onTap: () => _open(context, AppRouter.pos)),
            ListTile(leading: const Icon(Icons.local_shipping_outlined), title: Text(i18n.t('cc.orders')), onTap: () => _open(context, AppRouter.orders)),
            const Divider(),
            ListTile(leading: const Icon(Icons.shopping_cart_outlined), title: Text(i18n.t('drawer.purchases')), onTap: () => _open(context, AppRouter.purchases)),
            ListTile(leading: const Icon(Icons.point_of_sale_outlined), title: Text(i18n.t('drawer.sales')), onTap: () => _open(context, AppRouter.sales)),
            ListTile(leading: const Icon(Icons.visibility_outlined), title: Text(i18n.t('drawer.watchlist')), onTap: () => _open(context, AppRouter.watchlist)),
            ListTile(leading: const Icon(Icons.my_location_outlined), title: Text(i18n.t('cc.scouts')), onTap: () => _open(context, AppRouter.scouts)),
            const Divider(),
            ListTile(leading: const Icon(Icons.history), title: Text(i18n.t('history.title')), onTap: () => _open(context, AppRouter.dealHistory)),
            ListTile(leading: const Icon(Icons.analytics_outlined), title: Text(i18n.t('activity.log.title')), onTap: () => _open(context, AppRouter.activityLog)),
          ],
        ),
      ),
    );
  }
}