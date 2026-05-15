import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/market/application/market_engine.dart';

class MarketScreen extends ConsumerWidget {
  const MarketScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(marketEngineProvider);
    final engine = ref.read(marketEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Market Intelligence', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(marketEngineProvider),
          )
        ],
      ),
      drawer: const AppDrawer(),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          if (state.sources.isEmpty) {
            return const Center(
              child: Text(
                'No market sources configured on backend.',
                style: TextStyle(color: Colors.white54, fontSize: 16),
              ),
            );
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.purpleAccent.withValues(alpha: 0.15), Colors.blueAccent.withValues(alpha: 0.15)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Scraper Engines', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text('${state.sources.where((s) => s['enabled'] == true).length} active sources monitoring the market', style: const TextStyle(color: Colors.white70)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Text('Data Sources', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              ...state.sources.map((source) {
                final isEnabled = source['enabled'] == true;
                return Card(
                  color: const Color(0xFF171A21),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: isEnabled ? Colors.blueAccent.withValues(alpha: 0.3) : Colors.transparent),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: isEnabled ? Colors.blueAccent.withValues(alpha: 0.1) : Colors.grey.withValues(alpha: 0.1),
                      child: Icon(Icons.travel_explore, color: isEnabled ? Colors.blueAccent : Colors.grey),
                    ),
                    title: Text(source['name'] ?? source['code'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Type: ${source['type']}', style: const TextStyle(color: Colors.white54)),
                    trailing: isEnabled
                      ? FilledButton.tonalIcon(
                          icon: const Icon(Icons.play_arrow, size: 16),
                          label: const Text('Run'),
                          onPressed: () async {
                            try {
                              await engine.triggerScraper(source['code']);
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Scraper ${source['code']} queued successfully!'), backgroundColor: Colors.green),
                                );
                              }
                            } catch (e) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
                                );
                              }
                            }
                          },
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
                          child: const Text('DISABLED', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}