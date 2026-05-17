import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart';
import 'package:lego_trading_manager/features/activity/presentation/activity_timeline_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityLogScreen extends ConsumerWidget {
  const ActivityLogScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(activityEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('activity.log.title'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ActivityTimelineScreen())),
          )
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          if (state.logs.isEmpty) {
            return Center(child: Text(i18n.t('activity.log.empty'), style: const TextStyle(color: Colors.white54)));
          }

          return CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeroCard(state, i18n),
                      const SizedBox(height: 16),
                      _buildMetricGrid(state, i18n),
                      const SizedBox(height: 16),
                      _buildInsights(state, i18n),
                      const SizedBox(height: 24),
                      Text(i18n.t('activity.recentOps'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 12),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final item = state.logs[index];
                    return _LogTile(item: item, i18n: i18n);
                  },
                  childCount: state.logs.length > 10 ? 10 : state.logs.length,
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeroCard(ActivityEngineState state, I18nNotifier i18n) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.deepPurpleAccent.withValues(alpha: 0.15), Colors.blueAccent.withValues(alpha: 0.15)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${state.controlScore.toStringAsFixed(0)} ${i18n.t('activity.controlScore')}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Text(
            '${i18n.t('activity.momentum')}: ${i18n.t(state.momKey)} • ${i18n.t('activity.discipline')}: ${i18n.t(state.discKey)}',
            style: const TextStyle(color: Colors.white70),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildMetricGrid(ActivityEngineState state, I18nNotifier i18n) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 2.0,
      children: [
        _MiniCard(title: i18n.t('activity.activeStreak'), value: '${state.activeDayStreak}d', color: Colors.greenAccent),
        _MiniCard(title: i18n.t('activity.7day'), value: '${state.activeDaysInLast7}/7', color: Colors.blueAccent),
        _MiniCard(title: i18n.t('activity.bestDay'), value: state.bestDayCount.toString(), color: Colors.orangeAccent),
        _MiniCard(title: i18n.t('activity.topType'), value: state.topType, color: Colors.purpleAccent),
      ],
    );
  }

  Widget _buildInsights(ActivityEngineState state, I18nNotifier i18n) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          _RowStat(i18n.t('activity.totalReports'), state.reports.toString()),
          const Divider(color: Colors.white10),
          _RowStat(i18n.t('activity.totalPurchases'), state.purchases.toString()),
          const Divider(color: Colors.white10),
          _RowStat(i18n.t('activity.totalSales'), state.sales.toString()),
          const Divider(color: Colors.white10),
          _RowStat(i18n.t('activity.watchActions'), state.watchlist.toString()),
        ],
      ),
    );
  }
}

class _MiniCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  const _MiniCard({required this.title, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: color.withValues(alpha: 0.2))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(title, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Flexible(
            child: Text(
              value,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

class _RowStat extends StatelessWidget {
  final String label;
  final String value;
  const _RowStat(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(child: Text(label, style: const TextStyle(color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class _LogTile extends StatelessWidget {
  final ActivityLogEntryModel item;
  final I18nNotifier i18n;
  const _LogTile({required this.item, required this.i18n});

  IconData _icon() {
    switch (item.type) {
      case 'purchase': return Icons.shopping_cart;
      case 'sale': return Icons.sell;
      case 'report': return Icons.analytics;
      case 'watchlist': return Icons.bookmark;
      default: return Icons.bolt;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      leading: CircleAvatar(backgroundColor: Colors.white10, child: Icon(_icon(), color: Colors.white, size: 20)),
      title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(item.subtitle, style: const TextStyle(fontSize: 12, color: Colors.white70), maxLines: 2, overflow: TextOverflow.ellipsis),
      trailing: Text(item.createdAt.toIso8601String().split('T').first, style: const TextStyle(fontSize: 12)),
    );
  }
}