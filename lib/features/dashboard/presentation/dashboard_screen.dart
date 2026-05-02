import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/widgets/inventory_flow_dashboard_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: const ListView(
        padding: EdgeInsets.all(16),
        children: [
          InventoryFlowDashboardCard(),
        ],
      ),
    );
  }
}