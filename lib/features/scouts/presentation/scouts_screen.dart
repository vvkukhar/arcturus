import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/scouts/application/scouts_engine.dart';

class ScoutsScreen extends ConsumerStatefulWidget {
  const ScoutsScreen({super.key});

  @override
  ConsumerState<ScoutsScreen> createState() => _ScoutsScreenState();
}

class _ScoutsScreenState extends ConsumerState<ScoutsScreen> {
  String? _loadingId;

  Future<void> _handleReward(String id) async {
    final TextEditingController controller = TextEditingController(text: '100');
    final amountStr = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reward Scout'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Amount (UAH)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, controller.text), child: const Text('Reward')),
        ],
      ),
    );

    if (amountStr == null) return;
    final amount = double.tryParse(amountStr);
    if (amount == null || amount <= 0) return;

    setState(() => _loadingId = 'r_$id');
    try {
      await ref.read(scoutsEngineProvider.notifier).reward(id, amount);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Rewarded'), backgroundColor: Colors.green));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _loadingId = null);
    }
  }

  Future<void> _handleReject(String id) async {
    final TextEditingController controller = TextEditingController();
    final note = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reject Lead'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Reason (Optional)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, controller.text), 
            child: const Text('Reject')
          ),
        ],
      ),
    );

    if (note == null) return;

    setState(() => _loadingId = 'x_$id');
    try {
      await ref.read(scoutsEngineProvider.notifier).reject(id, note);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _loadingId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final stateAsync = ref.watch(scoutsEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('cc.scouts'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.invalidate(scoutsEngineProvider)),
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (leads) {
          if (leads.isEmpty) {
            return const Center(child: Text('No scout leads found', style: TextStyle(color: Colors.white54)));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            itemCount: leads.length,
            itemBuilder: (context, index) {
              final lead = leads[index];
              final isPending = lead['status'] == 'pending';

              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(lead['scout']?['name'] ?? 'Unknown Scout', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isPending ? Colors.orange.withValues(alpha: 0.2) : (lead['status'] == 'bought' ? Colors.green.withValues(alpha: 0.2) : Colors.red.withValues(alpha: 0.2)),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(lead['status'].toString().toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isPending ? Colors.orange : (lead['status'] == 'bought' ? Colors.green : Colors.red))),
                          )
                        ],
                      ),
                      const SizedBox(height: 8),
                      InkWell(
                        onTap: () async {
                          final url = Uri.parse(lead['url']);
                          if (await canLaunchUrl(url)) {
                            await launchUrl(url, mode: LaunchMode.externalApplication);
                          }
                        },
                        child: Text(lead['url'], style: const TextStyle(color: Colors.blueAccent, decoration: TextDecoration.underline), maxLines: 1, overflow: TextOverflow.ellipsis),
                      ),
                      if (lead['notes'] != null && lead['notes'].toString().isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(lead['notes'], style: const TextStyle(color: Colors.white70, fontSize: 13)),
                      ],
                      if (isPending) ...[
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: _loadingId != null ? null : () => _handleReject(lead['id']),
                                style: OutlinedButton.styleFrom(foregroundColor: Colors.redAccent, side: const BorderSide(color: Colors.redAccent)),
                                child: _loadingId == 'x_${lead['id']}' ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Reject'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: FilledButton(
                                onPressed: _loadingId != null ? null : () => _handleReward(lead['id']),
                                style: FilledButton.styleFrom(backgroundColor: Colors.green),
                                child: _loadingId == 'r_${lead['id']}' ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Reward'),
                              ),
                            ),
                          ],
                        )
                      ]
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