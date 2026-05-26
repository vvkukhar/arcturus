import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/monetization/application/monetization_engine.dart';

class MonetizationScreen extends ConsumerStatefulWidget {
  const MonetizationScreen({super.key});

  @override
  ConsumerState<MonetizationScreen> createState() => _MonetizationScreenState();
}

class _MonetizationScreenState extends ConsumerState<MonetizationScreen> {
  bool _isGenerating = false;

  Future<void> _handleGenerate() async {
    if (_isGenerating) return;
    setState(() => _isGenerating = true);
    try {
      await ref.read(monetizationEngineProvider.notifier).generateBoxes();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Boxes generated from dead stock'), backgroundColor: Colors.green));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isGenerating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final stateAsync = ref.watch(monetizationEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('cc.monetization'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.invalidate(monetizationEngineProvider)),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isGenerating ? null : _handleGenerate,
        backgroundColor: Colors.purpleAccent,
        icon: _isGenerating ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.auto_awesome, color: Colors.white),
        label: const Text('Generate Boxes', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (boxes) {
          if (boxes.isEmpty) {
            return const Center(child: Text('No active mystery boxes. Click generate to create from dead stock.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white54)));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            itemCount: boxes.length,
            itemBuilder: (context, index) {
              final box = boxes[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: Colors.purpleAccent.withValues(alpha: 0.3)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(child: Text(box['title'] ?? 'Mystery Box', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.purpleAccent))),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                            child: Text(box['tier']?.toString().toUpperCase() ?? 'STANDARD', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.amber)),
                          )
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(box['description'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      const SizedBox(height: 16),
                      Text(AppUtils.money(double.tryParse(box['price']?.toString() ?? '0') ?? 0), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}