import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_screen.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/inventory_flow_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchases_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sales_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_screen.dart';

class AppDrawer extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.inventory_2_outlined, size: 42),
                  SizedBox(height: 12),
                  Text(
                    'LEGO Trading Manager',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Arcturus Operations',
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined),
              title: const Text('Dashboard'),
              onTap: () => _open(context, const DashboardScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.inventory_2_outlined),
              title: const Text('Inventory'),
              onTap: () => _open(context, const InventoryScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.account_tree_outlined),
              title: const Text('Inventory Flow'),
              subtitle: const Text('Stock, allocations, ROI'),
              onTap: () => _open(context, const InventoryFlowScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.shopping_cart_outlined),
              title: const Text('Purchases'),
              onTap: () => _open(context, const PurchasesScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.point_of_sale_outlined),
              title: const Text('Sales'),
              onTap: () => _open(context, const SalesScreen()),
            ),
            ListTile(
              leading: const Icon(Icons.visibility_outlined),
              title: const Text('Watchlist'),
              onTap: () => _open(context, const WatchlistScreen()),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Settings'),
              onTap: () => _open(context, const SettingsScreen()),
            ),
          ],
        ),
      ),
    );
  }
}