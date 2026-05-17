import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class ActivityTimelineScreen extends ConsumerWidget {
  const ActivityTimelineScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(activityEngineProvider);
    final engine = ref.read(activityEngineProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('activity.timeline.title'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep, color: Colors.redAccent),
            onPressed: () => engine.clear(),
          )
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        onChanged: (v) => engine.filter(v, state.typeFilter),
                        decoration: InputDecoration(
                          hintText: i18n.t('activity.timeline.search'),
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                          fillColor: const Color(0xFF171A21),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 1,
                      child: DropdownButtonFormField<String?>(
                        value: state.typeFilter,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFF171A21),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                        ),
                        items: [
                          DropdownMenuItem(value: null, child: Text(i18n.t('activity.log.allTypes'))),
                          DropdownMenuItem(value: 'purchase', child: Text(i18n.t('activity.log.purchase'))),
                          DropdownMenuItem(value: 'sale', child: Text(i18n.t('activity.log.sale'))),
                          DropdownMenuItem(value: 'report', child: Text(i18n.t('activity.log.report'))),
                          DropdownMenuItem(value: 'watchlist', child: Text(i18n.t('activity.log.watchlist'))),
                        ],
                        onChanged: (v) => engine.filter(state.searchQuery, v),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: state.visibleLogs.isEmpty
                    ? Center(child: Text(i18n.t('activity.timeline.empty'), style: const TextStyle(color: Colors.white54)))
                    : ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        itemCount: state.visibleLogs.length,
                        itemBuilder: (context, index) {
                          final item = state.visibleLogs[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                            color: const Color(0xFF171A21),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: ListTile(
                              title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text(item.subtitle),
                              trailing: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(item.type.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.blueAccent, fontWeight: FontWeight.w900)),
                                  const SizedBox(height: 4),
                                  Text(item.createdAt.toIso8601String().split('T').first, style: const TextStyle(fontSize: 12)),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}