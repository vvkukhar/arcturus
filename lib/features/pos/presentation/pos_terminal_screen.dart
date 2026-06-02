import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/features/pos/application/pos_cart_provider.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_scanner_modal.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_checkout_dialog.dart';

class PosTerminalScreen extends ConsumerStatefulWidget {
  const PosTerminalScreen({super.key});

  @override
  ConsumerState<PosTerminalScreen> createState() => _PosTerminalScreenState();
}

class _PosTerminalScreenState extends ConsumerState<PosTerminalScreen> {
  final _searchController = TextEditingController();
  final _focusNode = FocusNode();
  bool _isProcessing = false;

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  Future<void> _handleScan(String code) async {
    if (code.trim().isEmpty) return;
    
    final network = ref.read(networkCoreProvider);
    final i18n = ref.read(i18nProvider.notifier);

    try {
      final res = await network.request('POST', '/pos/scan', body: {'barcode': code.trim()});
      if (res != null) {
        final item = InventoryItemModel.fromMap(Map<String, dynamic>.from(res));
        ref.read(posCartProvider.notifier).addItem(item);
        _searchController.clear();
        _focusNode.requestFocus();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(i18n.t('pos.notFound')), backgroundColor: Colors.redAccent),
        );
      }
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
          SnackBar(content: Text(i18n.t('common.error', {'error': e.toString()})), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
        _focusNode.requestFocus();
      }
    }
  }

  void _showCheckoutDialog(double total) {
    showDialog(
      context: context,
      builder: (_) => PosCheckoutDialog(
        total: total,
        onCard: () => _checkout('card'),
        onCash: () => _checkout('cash'),
        onCrypto: () => _checkout('crypto'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = ref.watch(posCartProvider);
    final cartNotifier = ref.read(posCartProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    double total = 0;
    for (final c in cart) {
      total += (c.item.expectedSalePriceManual ?? c.item.totalCost) * c.quantity;
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
                hintText: i18n.t('pos.searchHint'),
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
                        final price = c.item.expectedSalePriceManual ?? c.item.totalCost;
                        return ListTile(
                          title: Text(c.item.titleSnapshot, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('#${c.item.item?.setNumber ?? c.item.id.substring(0,6)} • ${AppUtils.money(price)}'),
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
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: FilledButton.icon(
                      style: FilledButton.styleFrom(backgroundColor: Colors.blueAccent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                      onPressed: cart.isEmpty || _isProcessing ? null : () => _showCheckoutDialog(total),
                      icon: _isProcessing ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.point_of_sale),
                      label: const Text('Charge Customer', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
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