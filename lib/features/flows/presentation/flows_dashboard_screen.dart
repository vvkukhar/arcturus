import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/flows/application/flows_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class FlowsDashboardScreen extends ConsumerWidget {
  const FlowsDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(flowsEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text(i18n.t('cc.flows'), style: const TextStyle(fontWeight: FontWeight.w900)),
          bottom: TabBar(
            indicatorColor: Colors.blueAccent,
            tabs: [
              Tab(text: i18n.t('pur.title')),
              Tab(text: i18n.t('flow.reprice.title')),
              Tab(text: i18n.t('flow.review.title')),
            ],
          ),
        ),
        body: stateAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
          data: (state) {
            return TabBarView(
              children: [
                _FlowList(items: state.purchases, type: 'purchase', engine: ref.read(flowsEngineProvider.notifier)),
                _FlowList(items: state.reprices, type: 'reprice', engine: ref.read(flowsEngineProvider.notifier)),
                _FlowList(items: state.reviews, type: 'review', engine: ref.read(flowsEngineProvider.notifier)),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _FlowList extends ConsumerWidget {
  final List<Map<String, dynamic>> items;
  final String type;
  final FlowsEngine engine;

  const _FlowList({required this.items, required this.type, required this.engine});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) return Center(child: Text(i18n.t('flow.$type.empty'), style: const TextStyle(color: Colors.white54)));

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        final isDone = item['status'] != 'pending';
        
        return Card(
          color: isDone ? Colors.green.withValues(alpha: 0.05) : const Color(0xFF171A21),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: isDone ? Colors.green.withValues(alpha: 0.3) : Colors.transparent),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ID: ${item['id'].toString().substring(0, 8)}...', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white70)),
                      const SizedBox(height: 4),
                      Text('${i18n.t('flow.purchase.status')} ${item['status'].toString().toUpperCase()}', style: TextStyle(fontWeight: FontWeight.w900, color: isDone ? Colors.green : Colors.orange)),
                    ],
                  ),
                ),
                if (!isDone)
                  IconButton(
                    icon: const Icon(Icons.check_circle_outline, color: Colors.green),
                    onPressed: () {
                      final action = type == 'purchase' ? 'mark-bought' : type == 'reprice' ? 'mark-listed' : 'mark-reviewed';
                      engine.processAction(type, action, item['id']);
                    },
                  ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                  onPressed: () => engine.processAction(type, 'remove', item['id']),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}