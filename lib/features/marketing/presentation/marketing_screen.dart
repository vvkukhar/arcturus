import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/marketing/application/marketing_engine.dart';

class MarketingScreen extends ConsumerWidget {
  const MarketingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isProcessing = ref.watch(marketingEngineProvider);
    final engine = ref.read(marketingEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('AI Marketing Hub', style: TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildCard(
            title: 'SMM Broadcaster',
            subtitle: 'Auto-generate FOMO posts for Telegram channel based on latest inventory.',
            icon: Icons.campaign,
            color: Colors.blueAccent,
            isProcessing: isProcessing,
            onTap: () async {
              try {
                await engine.dispatchSmm();
                if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('SMM Job Queued!'), backgroundColor: Colors.green));
              } catch (e) {
                if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
              }
            }
          ),
          const SizedBox(height: 16),
          _buildCard(
            title: 'LTV Maximizer',
            subtitle: 'Cross-sell related sets to existing customers via Telegram.',
            icon: Icons.group_add,
            color: Colors.emerald,
            isProcessing: isProcessing,
            onTap: () async {
              try {
                await engine.dispatchLtv();
                if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('LTV Job Queued!'), backgroundColor: Colors.green));
              } catch (e) {
                if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
              }
            }
          ),
        ],
      ),
    );
  }

  Widget _buildCard({required String title, required String subtitle, required IconData icon, required Color color, required bool isProcessing, required VoidCallback onTap}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF171A21),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(width: 12),
              Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            ],
          ),
          const SizedBox(height: 12),
          Text(subtitle, style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              style: FilledButton.styleFrom(backgroundColor: color, padding: const EdgeInsets.symmetric(vertical: 16)),
              onPressed: isProcessing ? null : onTap,
              child: isProcessing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Dispatch Job', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          )
        ],
      ),
    );
  }
}