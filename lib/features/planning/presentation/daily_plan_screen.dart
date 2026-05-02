import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../application/daily_plan_provider.dart';

class DailyPlanScreen extends ConsumerWidget {
  const DailyPlanScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final plan = ref.watch(dailyPlanProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Plan'),
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
                  title: Text('${t.order}. ${t.title}'),
                  subtitle: Text(t.reason),
                  trailing: Text(t.type),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}