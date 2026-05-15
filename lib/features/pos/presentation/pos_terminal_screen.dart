import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/features/pos/application/pos_cart_provider.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_scanner_modal.dart';

class PosTerminalScreen extends ConsumerStatefulWidget {
  const PosTerminalScreen({super.key});

  @override
  ConsumerState<PosTerminalScreen> createState() => _PosTerminalScreenState();
}

class _PosTerminalScreenState extends ConsumerState<PosTerminalScreen> {
  final _searchController = TextEditingController();
  final _focusNode = FocusNode();
  bool _isProcessing = false;

  void _handleScan(String code) {
    if (code.trim().isEmpty) return;
    
    final invRepo = ref.read(inventoryRepositoryProvider);
    final items = invRepo.getAllItems();
    
    // ФІКС: Тепер шукає по Inventory ID, Set Number АБО по шматку Назви!
    final match = items.where((i) => 
      (i.id.toLowerCase() == code.toLowerCase() || 
       (i.setId != null && i.setId!.toLowerCase() == code.toLowerCase()) ||
       i.title.toLowerCase().contains(code.toLowerCase())) && 
      i.isActive && i.quantity > 0
    ).firstOrNull;

    if (match != null) {
      ref.read(posCartProvider.notifier).addItem(match);
      _searchController.clear();
      _focusNode.requestFocus();
    } else {
      final i18n = ref.read(i18nProvider.notifier);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(i18n.t('pos.notFound')), backgroundColor: Colors.redAccent),
      );
    }
  }

  Future<void> _openCameraScanner() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (_) => const PosScannerModal()),
    );
    if (result != null) {
      _handleScan(result);
    }
  }

  Future<void> _checkout(String method) async {
    if (_isProcessing) return;
    final i18n = ref.read(i18nProvider.notifier);
    
    setState(() => _isProcessing = true);
    try {
      await ref.read(posCartProvider.notifier).checkout(method);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(i18n.t('pos.checkoutSuccess')), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      setState(() => _isProcessing = false);
      _focusNode.requestFocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(posCartProvider);
    final cartNotifier = ref.read(posCartProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    double total = 0;
    for (final c in cart) {
      total += (c.item.expectedSalePrice ?? c.item.totalCost) * c.quantity;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('pos.title'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.camera_alt),
            onPressed: _openCameraScanner,
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              focusNode: _focusNode,
              autofocus: true,
              onSubmitted: _handleScan,
              decoration: InputDecoration(
                hintText: 'Search by ID, Set Number or Title...',
                prefixIcon: const Icon(Icons.qr_code_scanner),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.camera_alt, color: Colors.blueAccent),
                  onPressed: _openCameraScanner,
                ),
                filled: true,
                fillColor: const Color(0xFF171A21),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Container(
                decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                child: cart.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.shopping_cart_outlined, size: 64, color: Colors.white24),
                          const SizedBox(height: 16),
                          Text(i18n.t('pos.empty'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white54)),
                          Text(i18n.t('pos.scanStart'), style: const TextStyle(color: Colors.white38)),
                        ],
                      ),
                    )
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: cart.length,
                      itemBuilder: (context, index) {
                        final c = cart[index];
                        final price = c.item.expectedSalePrice ?? c.item.totalCost;
                        return ListTile(
                          title: Text(c.item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('#${c.item.setId ?? c.item.id.substring(0,6)} • ${AppUtils.money(price)}'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline, color: Colors.white54),
                                onPressed: () => cartNotifier.updateQuantity(c.item.id, c.quantity - 1),
                              ),
                              Text('${c.quantity}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline, color: Colors.white54),
                                onPressed: () => cartNotifier.updateQuantity(c.item.id, c.quantity + 1),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete, color: Colors.redAccent),
                                onPressed: () => cartNotifier.removeItem(c.item.id),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(20)),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(i18n.t('pos.total').toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.white54)),
                      Text(AppUtils.money(total), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.blueAccent)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton.icon(
                          style: FilledButton.styleFrom(backgroundColor: Colors.blueAccent, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                          onPressed: cart.isEmpty || _isProcessing ? null : () => _checkout('card'),
                          icon: _isProcessing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.credit_card),
                          label: Text(i18n.t('pos.card'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton.icon(
                          style: FilledButton.styleFrom(backgroundColor: Colors.green, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                          onPressed: cart.isEmpty || _isProcessing ? null : () => _checkout('cash'),
                          icon: _isProcessing ? const SizedBox() : const Icon(Icons.payments_outlined),
                          label: Text(i18n.t('pos.cash'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}