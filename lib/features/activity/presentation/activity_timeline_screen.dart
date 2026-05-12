import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart';

class ActivityTimelineScreen extends ConsumerWidget {
  const ActivityTimelineScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(activityEngineProvider);
    final engine = ref.read(activityEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Timeline', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep, color: Colors.redAccent),
            onPressed: () => engine.clear(),
          )
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
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
                          hintText: 'Search...',
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
                        items: const [
                          DropdownMenuItem(value: null, child: Text('All')),
                          DropdownMenuItem(value: 'purchase', child: Text('Buy')),
                          DropdownMenuItem(value: 'sale', child: Text('Sell')),
                          DropdownMenuItem(value: 'report', child: Text('Report')),
                          DropdownMenuItem(value: 'watchlist', child: Text('Watch')),
                        ],
                        onChanged: (v) => engine.filter(state.searchQuery, v),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: state.visibleLogs.isEmpty
                    ? const Center(child: Text('No matching records found.', style: TextStyle(color: Colors.white54)))
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