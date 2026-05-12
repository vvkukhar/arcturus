import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_engine.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class DashboardLiveScreen extends ConsumerWidget {
  const DashboardLiveScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(dashboardEngineProvider);
    final syncState = ref.watch(syncEngineProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Dashboard', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.hub_outlined), onPressed: () => Navigator.pushNamed(context, AppRouter.commandCenter)),
        ],
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  if (!(syncState.value?.isOnline ?? true))
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(color: Colors.orange.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
                      child: const Row(children: [Icon(Icons.cloud_off, color: Colors.orange), SizedBox(width: 10), Text('Offline Mode')]),
                    ),
                  _buildHeroCard(state),
                  const SizedBox(height: 24),
                  _buildMetricsGrid(state),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildHeroCard(DashboardEngineState state) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.blueAccent.withValues(alpha: 0.15), Colors.greenAccent.withValues(alpha: 0.15)]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(state.headline, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(state.subline, style: const TextStyle(color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildMetricsGrid(DashboardEngineState state) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _MetricTile('Capital', state.totalInvested.toStringAsFixed(0), Colors.blue),
        _MetricTile('Profit', state.expectedOpenProfit.toStringAsFixed(0), Colors.green),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  final String title, value;
  final Color color;
  const _MetricTile(this.title, this.value, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
    child: Column(children: [Text(title, style: TextStyle(color: color)), Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold))]),
  );
}