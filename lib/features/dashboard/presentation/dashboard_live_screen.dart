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
    final stateAsync = ref.watch(dashboardEngineProvider);
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
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) => CustomScrollView(
          physics: const BouncingScrollPhysics(),
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
                    
                    // ФІКС: Тепер ми ВИВОДИМО ці дії на екран!
                    if (state.priorityQueue.isNotEmpty) ...[
                      const SizedBox(height: 32),
                      _buildPriorityQueue(state.priorityQueue, context),
                    ],
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard(DashboardEngineState state) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.blueAccent.withValues(alpha: 0.15), Colors.greenAccent.withValues(alpha: 0.15)]),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          Text(state.headline, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          const SizedBox(height: 4),
          Text(state.subline, style: const TextStyle(color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildMetricsGrid(DashboardEngineState state) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _MetricTile('Capital', '${state.totalInvested.toStringAsFixed(0)} ${state.currency}', Colors.blue),
        _MetricTile('Profit', '${state.expectedOpenProfit.toStringAsFixed(0)} ${state.currency}', Colors.green),
      ],
    );
  }

  // ФІКС: Блок для відображення знайдених угод та проблем
  Widget _buildPriorityQueue(List<DashboardAction> queue, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Align(
          alignment: Alignment.centerLeft,
          child: Text('Priority Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 12),
        ...queue.map((action) {
          final isGood = action.type == 'good';
          final color = isGood ? Colors.greenAccent : Colors.redAccent;
          final icon = isGood ? Icons.local_fire_department : Icons.warning_amber_rounded;
          
          return Card(
            color: const Color(0xFF171A21),
            margin: const EdgeInsets.only(bottom: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: color.withValues(alpha: 0.3)),
            ),
            child: ListTile(
              leading: Icon(icon, color: color),
              title: Text(action.title, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(action.subtitle, style: const TextStyle(color: Colors.white70)),
              trailing: const Icon(Icons.chevron_right, color: Colors.white30),
              onTap: () {
                if (isGood) {
                  // Якщо це крута угода (Buy...) - кидаємо в Deal Evaluator
                  Navigator.pushNamed(context, AppRouter.dealEvaluator);
                } else {
                  // Якщо це проблема з інвентарем - кидаємо в Інвентар
                  Navigator.pushNamed(context, AppRouter.inventory);
                }
              },
            ),
          );
        }),
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
    decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: color.withValues(alpha: 0.2))),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold)), 
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900), maxLines: 1, overflow: TextOverflow.ellipsis)
      ]
    ),
  );
}