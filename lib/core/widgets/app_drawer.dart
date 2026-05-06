import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_screen.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/inventory_flow_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchases_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sales_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_screen.dart';

class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  void _open(BuildContext context, Widget screen) {
    Navigator.of(context).pop();

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => screen,
      ),
    );
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
                  Text(
                    i18n.t('drawer.title'),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    i18n.t('drawer.subtitle'),
                    style: const TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined),
              title: Text(i18n.t('drawer.dashboard')),
              onTap: () => _open(context, const DashboardScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.inventory_2_outlined),
              title: Text(i18n.t('drawer.inventory')),
              onTap: () => _open(context, const InventoryScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.account_tree_outlined),
              title: Text(i18n.t('drawer.inventoryFlow')),
              subtitle: Text(i18n.t('drawer.inventoryFlowSub')),
              onTap: () => _open(context, const InventoryFlowScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.shopping_cart_outlined),
              title: Text(i18n.t('drawer.purchases')),
              onTap: () => _open(context, const PurchasesScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.point_of_sale_outlined),
              title: Text(i18n.t('drawer.sales')),
              onTap: () => _open(context, const SalesScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.visibility_outlined),
              title: Text(i18n.t('drawer.watchlist')),
              onTap: () => _open(context, const WatchlistScreen()),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: Text(i18n.t('drawer.settings')),
              onTap: () => _open(context, const SettingsScreen()),
            ),
          ],
        ),
      ),
    );
  }
}