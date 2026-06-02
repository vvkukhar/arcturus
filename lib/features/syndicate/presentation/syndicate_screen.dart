import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/syndicate/application/syndicate_engine.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';

class SyndicateScreen extends ConsumerWidget {
  const SyndicateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(syndicateEngineProvider);
    final engine = ref.read(syndicateEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('The Syndicate', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.invalidate(syndicateEngineProvider)),
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (data) {
          if (data.isEmpty) return const Center(child: Text('Data not available'));

          final code = data['referralCode'];
          final rewards = data['rewards'] as List? ?? [];

          return ListView(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Network Yield', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                          const SizedBox(height: 8),
                          Text('${data['totalEarnedAC'] ?? 0} AC', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.greenAccent)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Referrals', style: TextStyle(color: Colors.blueAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                          const SizedBox(height: 8),
                          Text('${data['referralsCount'] ?? 0}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.blueAccent)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.blueAccent.withValues(alpha: 0.15), Colors.purpleAccent.withValues(alpha: 0.15)]),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.3)),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.share, size: 48, color: Colors.blueAccent),
                    const SizedBox(height: 16),
                    const Text('Recruitment Link', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
                    const SizedBox(height: 8),
                    code != null
                      ? Column(
                          children: [
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(12)),
                              child: Text('arcturus.store/register?ref=$code', textAlign: TextAlign.center, style: const TextStyle(fontFamily: 'monospace', color: Colors.greenAccent, fontWeight: FontWeight.bold)),
                            ),
                            const SizedBox(height: 16),
                            FilledButton.icon(
                              onPressed: () {
                                engine.copyCode(code);
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Copied to clipboard'), backgroundColor: Colors.green));
                              },
                              icon: const Icon(Icons.copy),
                              label: const Text('Copy Link'),
                            )
                          ],
                        )
                      : FilledButton(
                          onPressed: () => engine.generateCode(),
                          child: const Text('Generate Referral Link'),
                        )
                  ],
                ),
              ),
              const SizedBox(height: 32),
              const Text('Reward History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              if (rewards.isEmpty)
                const Center(child: Padding(padding: EdgeInsets.all(32), child: Text('No rewards yet', style: TextStyle(color: Colors.white54)))),
              ...rewards.map((r) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const CircleAvatar(backgroundColor: Colors.white10, child: Icon(Icons.bolt, color: Colors.greenAccent)),
                title: Text('+${r['amount']} AC', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.greenAccent)),
                subtitle: Text(r['sourceType'] == 'marketplace_fee' ? 'Marketplace Sale' : 'Vault Dividends', style: const TextStyle(color: Colors.white70)),
                trailing: Text(AppUtils.dateYMD(DateTime.parse(r['createdAt'])), style: const TextStyle(fontSize: 12, color: Colors.white54)),
              ))
            ],
          );
        },
      ),
    );
  }
}