import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/partout/application/partout_engine.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PartOutScreen extends ConsumerWidget {
  const PartOutScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(partOutEngineProvider);
    final engine = ref.read(partOutEngineProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('partout.title'), style: const TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {}, 
        icon: const Icon(Icons.precision_manufacturing),
        label: Text(i18n.t('partout.add')),
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: TextField(
                  onChanged: engine.search,
                  decoration: InputDecoration(
                    hintText: i18n.t('partout.search'),
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                    fillColor: const Color(0xFF171A21),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
              ),
              Expanded(
                child: state.projects.isEmpty
                    ? Center(child: Text(i18n.t('partout.empty'), style: const TextStyle(color: Colors.white54)))
                    : ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: state.projects.length,
                        itemBuilder: (context, index) {
                          final computed = state.projects[index];
                          final p = computed.project;
                          final isProfitable = computed.expectedProfit > 0;
                          
                          return Card(
                            color: const Color(0xFF171A21),
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            child: ExpansionTile(
                              title: Text(p.sourceSetTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('Status: ${p.status.name} • Lines: ${computed.lines.length}'),
                              trailing: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(i18n.t('inv.expectedProfit'), style: const TextStyle(fontSize: 10, color: Colors.white54)),
                                  Text(
                                    computed.expectedProfit.toStringAsFixed(0),
                                    style: TextStyle(fontWeight: FontWeight.w900, color: isProfitable ? Colors.greenAccent : Colors.redAccent),
                                  ),
                                ],
                              ),
                              children: [
                                const Divider(color: Colors.white10),
                                ...computed.lines.map((line) => ListTile(
                                  dense: true,
                                  title: Text(line.title),
                                  subtitle: Text('${line.quantity}x ${line.expectedUnitPrice} = ${line.expectedTotalPrice}'),
                                  trailing: Text(line.status.name.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                                ))
                              ],
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