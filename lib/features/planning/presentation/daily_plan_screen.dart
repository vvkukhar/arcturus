import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import '../application/daily_plan_provider.dart';

class DailyPlanScreen extends ConsumerWidget {
  const DailyPlanScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final plan = ref.watch(dailyPlanProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Daily Plan')),
      ),
      body: plan.when(
        data: (tasks) {
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final t = tasks[index];
              return Card(
                child: ListTile(
                  title: Text('${t.order}. ${i18n.t(t.title)}'),
                  subtitle: Text(i18n.t(t.reason)),
                  trailing: Text(i18n.t(t.type)),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('${i18n.t('common.error', {'error': e.toString()})}')),
      ),
    );
  }
}