import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/available_purchases_for_sale_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_fifo_allocation_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/purchase_stock_card.dart';

class SaleInventoryAllocationScreen extends ConsumerStatefulWidget {
  final SaleModel sale;

  const SaleInventoryAllocationScreen({
    super.key,
    required this.sale,
  });

  @override
  ConsumerState<SaleInventoryAllocationScreen> createState() =>
      _SaleInventoryAllocationScreenState();
}

class _SaleInventoryAllocationScreenState
    extends ConsumerState<SaleInventoryAllocationScreen> {
  late final TextEditingController _quantityController;

  @override
  void initState() {
    super.initState();

    final currentAllocation = ref.read(
      saleAllocationSummaryProvider(widget.sale),
    );

    final defaultQuantity = currentAllocation.hasAllocation
        ? currentAllocation.allocatedQuantity
        : widget.sale.quantity;

    _quantityController = TextEditingController(
      text: defaultQuantity.toString(),
    );
  }

  int _parseQuantity() {
    return int.tryParse(_quantityController.text.trim()) ?? widget.sale.quantity;
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  Future<void> _allocateSingleLot(PurchaseModel purchase) async {
    final quantity = _parseQuantity();

    if (quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Quantity must be greater than zero')),
      );
      return;
    }

    if (quantity > widget.sale.quantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Cannot allocate more than sale quantity (${widget.sale.quantity})',
          ),
        ),
      );
      return;
    }

    if (quantity > purchase.remainingQuantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Only ${purchase.remainingQuantity} units available in this lot',
          ),
        ),
      );
      return;
    }

    await ref.read(inventorySaleAllocationControllerProvider.notifier).allocate(
          saleId: widget.sale.id,
          purchaseId: purchase.id,
          itemId: purchase.itemId,
          quantity: quantity,
        );

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Stock allocated to sale')),
    );

    Navigator.of(context).pop();
  }

  Future<void> _allocateFifo() async {
    final purchases = ref.read(availablePurchasesForSaleProvider(widget.sale));
    final fifo = ref.read(inventoryFifoAllocationProvider);

    final result = fifo.allocate(
      sale: widget.sale,
      availablePurchases: purchases,
    );

    if (result.allocations.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result.message)),
      );
      return;
    }

    await ref
        .read(inventorySaleAllocationControllerProvider.notifier)
        .replaceSaleAllocations(
          saleId: widget.sale.id,
          allocations: result.allocations,
        );

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          result.success
              ? 'FIFO allocated ${result.allocatedQuantity}/${result.requestedQuantity}'
              : 'Partial FIFO: ${result.allocatedQuantity}/${result.requestedQuantity}, missing ${result.missingQuantity}',
        ),
      ),
    );

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final purchases = ref.watch(availablePurchasesForSaleProvider(widget.sale));
    final currentAllocation = ref.watch(
      saleAllocationSummaryProvider(widget.sale),
    );

    final totalAvailable = purchases.fold<int>(
      0,
      (sum, purchase) => sum + purchase.remainingQuantity,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Allocate Stock'),
        actions: [
          IconButton(
            onPressed: purchases.isEmpty ? null : _allocateFifo,
            icon: const Icon(Icons.auto_mode_outlined),
            tooltip: 'FIFO allocate',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sale item: ${widget.sale.itemId}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Sale quantity: ${widget.sale.quantity}'),
                  Text(
                    'Currently allocated: ${currentAllocation.allocatedQuantity}',
                  ),
                  Text('Available stock: $totalAvailable'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: purchases.isEmpty ? null : _allocateFifo,
            icon: const Icon(Icons.auto_mode_outlined),
            label: const Text('Auto FIFO Allocate'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _quantityController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Quantity for single-lot allocation',
            ),
          ),
          const SizedBox(height: 16),
          if (purchases.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No available purchase stock for this item.'),
              ),
            )
          else
            ...purchases.map(
              (purchase) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: PurchaseStockCard(
                  purchase: purchase,
                  onTap: () => _allocateSingleLot(purchase),
                ),
              ),
            ),
        ],
      ),
    );
  }
}