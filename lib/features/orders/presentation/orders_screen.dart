import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/orders/application/orders_engine.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  final Set<String> _selectedIds = {};
  bool _isProcessing = false;

  void _toggleSelect(String id) {
    setState(() {
      if (_selectedIds.contains(id)) {
        _selectedIds.remove(id);
      } else {
        _selectedIds.add(id);
      }
    });
  }

  Future<void> _handleBulkTtn() async {
    if (_selectedIds.isEmpty || _isProcessing) return;
    setState(() => _isProcessing = true);
    try {
      await ref.read(ordersEngineProvider.notifier).generateTtn(_selectedIds.toList());
      setState(() => _selectedIds.clear());
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('TTNs Generated Successfully'), backgroundColor: Colors.green));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _handleBulkPdf() async {
    if (_selectedIds.isEmpty || _isProcessing) return;
    setState(() => _isProcessing = true);
    try {
      final urlStr = await ref.read(ordersEngineProvider.notifier).generatePdf(_selectedIds.toList());
      if (urlStr != null) {
        final url = Uri.parse(urlStr);
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final stateAsync = ref.watch(ordersEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('cc.orders'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.invalidate(ordersEngineProvider)),
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (orders) {
          if (orders.isEmpty) {
            return const Center(child: Text('No orders found', style: TextStyle(color: Colors.white54)));
          }

          return Column(
            children: [
              if (_selectedIds.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.blueAccent.withValues(alpha: 0.1),
                  child: Row(
                    children: [
                      Text('${_selectedIds.length} selected', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                      const Spacer(),
                      if (_isProcessing)
                        const SizedBox(width: 24, height: 24, child: CircularProgressIndicator())
                      else ...[
                        OutlinedButton.icon(
                          onPressed: _handleBulkTtn,
                          icon: const Icon(Icons.local_shipping),
                          label: const Text('TTN'),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.icon(
                          onPressed: _handleBulkPdf,
                          icon: const Icon(Icons.picture_as_pdf),
                          label: const Text('PDF'),
                        ),
                      ]
                    ],
                  ),
                ),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  physics: const BouncingScrollPhysics(),
                  itemCount: orders.length,
                  itemBuilder: (context, index) {
                    final o = orders[index];
                    final isSelected = _selectedIds.contains(o['id']);
                    final isActionable = ['approved', 'contacted', 'pending'].contains(o['status']) || (o['adminNote']?.toString().contains('[TTN:') ?? false);

                    return Card(
                      color: const Color(0xFF171A21),
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: BorderSide(color: isSelected ? Colors.blueAccent : Colors.transparent),
                      ),
                      child: ListTile(
                        leading: isActionable ? Checkbox(
                          value: isSelected,
                          onChanged: (_) => _toggleSelect(o['id']),
                          activeColor: Colors.blueAccent,
                        ) : null,
                        title: Text(o['productTitle'] ?? 'Unknown', style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${o['buyerName']} • ${o['contact']}', style: const TextStyle(color: Colors.white70)),
                            const SizedBox(height: 4),
                            Text('Status: ${o['status'].toString().toUpperCase()}', style: TextStyle(color: o['status'] == 'sold' ? Colors.green : Colors.orange, fontWeight: FontWeight.bold, fontSize: 12)),
                            if (o['adminNote'] != null && o['adminNote'].toString().contains('[TTN:'))
                              Text(o['adminNote'], style: const TextStyle(color: Colors.blueAccent, fontSize: 12, fontWeight: FontWeight.w900)),
                          ],
                        ),
                        trailing: Text(AppUtils.money(double.tryParse(o['sellPrice']?.toString() ?? '0') ?? 0), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
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