import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/vault/application/vault_engine.dart';

class VaultScreen extends ConsumerStatefulWidget {
  const VaultScreen({super.key});

  @override
  ConsumerState<VaultScreen> createState() => _VaultScreenState();
}

class _VaultScreenState extends ConsumerState<VaultScreen> {
  final _depositController = TextEditingController();
  bool _isProcessing = false;

  @override
  void dispose() {
    _depositController.dispose();
    super.dispose();
  }

  Future<void> _handleDeposit() async {
    final amount = double.tryParse(_depositController.text) ?? 0;
    if (amount < 1000 || _isProcessing) return;

    setState(() => _isProcessing = true);
    try {
      await ref.read(vaultEngineProvider.notifier).deposit(amount);
      _depositController.clear();
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Deposit Error: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _handleInvest(String dealId) async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);
    try {
      await ref.read(vaultEngineProvider.notifier).invest(dealId);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Deal Funded!'), backgroundColor: Colors.green));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Investment Error: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final stateAsync = ref.watch(vaultEngineProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Arcturus Vault', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.invalidate(vaultEngineProvider)),
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) {
          return ListView(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.amber.withValues(alpha: 0.15), Colors.orange.withValues(alpha: 0.15)]),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Liquid Capital', style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, letterSpacing: 1.2, fontSize: 12)),
                    const SizedBox(height: 8),
                    Text(AppUtils.money(state.balance), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white)),
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _depositController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(hintText: 'Amount (Min 1000)'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: Colors.amber, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 16)),
                          onPressed: _isProcessing ? null : _handleDeposit,
                          child: _isProcessing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2)) : const Icon(Icons.add),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Active Positions', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Text('${state.portfolio.length}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text('Executable Deals', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              if (state.deals.isEmpty)
                const Center(child: Padding(padding: EdgeInsets.all(32), child: Text('No active deals match criteria', style: TextStyle(color: Colors.white54)))),
              ...state.deals.map((deal) => Card(
                    color: const Color(0xFF171A21),
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(deal['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), maxLines: 2, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Entry', style: TextStyle(color: Colors.white54, fontSize: 10)),
                                  Text(AppUtils.money(double.tryParse(deal['buyPrice'].toString()) ?? 0), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  const Text('Est. Return (+80%)', style: TextStyle(color: Colors.greenAccent, fontSize: 10)),
                                  Text('+${AppUtils.money((double.tryParse(deal['profit'].toString()) ?? 0) * 0.8)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Colors.greenAccent)),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton.tonalIcon(
                              onPressed: _isProcessing || state.balance < (deal['buyPrice'] as num) ? null : () => _handleInvest(deal['id']),
                              icon: const Icon(Icons.rocket_launch),
                              label: const Text('Execute Trade'),
                              style: FilledButton.styleFrom(backgroundColor: Colors.blueAccent.withValues(alpha: 0.2), foregroundColor: Colors.blueAccent),
                            ),
                          )
                        ],
                      ),
                    ),
                  )),
            ],
          );
        },
      ),
    );
  }
}