import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lot_view_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lots_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_validation_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/sale_inventory_allocation_screen.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/edit_allocation_lot_dialog.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sale_allocation_lots_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sale_allocation_summary_card.dart';
import 'package:lego_trading_manager/features/inventory_flow/presentation/widgets/sale_allocation_validation_card.dart';
import 'package:lego_trading_manager/features/sales/application/sale_duplicate_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_linked_purchase_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_breakdown_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_profit_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_quality_score_provider.dart';
import 'package:lego_trading_manager/features/sales/presentation/edit_sale_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sale_purchase_link_picker_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_identity_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_net_breakdown_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_profit_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_purchase_link_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_quality_score_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_revenue_breakdown_card.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_timeline_card.dart';

class SaleDetailsScreen extends ConsumerStatefulWidget {
  final SaleModel sale;

  const SaleDetailsScreen({
    super.key,
    required this.sale,
  });

  @override
  ConsumerState<SaleDetailsScreen> createState() => _SaleDetailsScreenState();
}

class _SaleDetailsScreenState extends ConsumerState<SaleDetailsScreen> {
  late SaleModel sale;

  @override
  void initState() {
    super.initState();
    sale = widget.sale;
  }

  Future<void> _openEdit() async {
    final result = await Navigator.of(context).push<SaleModel>(
      MaterialPageRoute(
        builder: (_) => EditSaleScreen(sale: sale),
      ),
    );

    if (result == null) return;

    setState(() {
      sale = result;
    });

    if (!mounted) return;
    Navigator.of(context).pop({'updated': result});
  }

  Future<void> _confirmDelete() async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Delete sale'),
          content: const Text('Delete this sale record?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (shouldDelete != true) return;

    await ref
        .read(inventorySaleAllocationControllerProvider.notifier)
        .clearSale(sale.id);

    await ref
        .read(salePurchaseLinkControllerProvider.notifier)
        .unlinkSale(sale.id);

    if (!mounted) return;

    Navigator.of(context).pop({
      'deleted': true,
      'id': sale.id,
    });
  }

  void _duplicate() {
    final duplicated = ref.read(saleDuplicateProvider).duplicate(sale);

    Navigator.of(context).pop({
      'duplicated': duplicated,
    });
  }

  Future<void> _openLinkPurchase() async {
    final result = await Navigator.of(context).push<PurchaseModel>(
      MaterialPageRoute(
        builder: (_) => SalePurchaseLinkPickerScreen(sale: sale),
      ),
    );

    if (result == null) return;

    await ref.read(salePurchaseLinkControllerProvider.notifier).link(
          saleId: sale.id,
          purchaseId: result.id,
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Purchase linked')),
    );
  }

  Future<void> _unlinkPurchase() async {
    await ref
        .read(salePurchaseLinkControllerProvider.notifier)
        .unlinkSale(sale.id);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Purchase unlinked')),
    );
  }

  Future<void> _openAllocateStock() async {
    await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => SaleInventoryAllocationScreen(sale: sale),
      ),
    );
  }

  Future<void> _clearAllocation() async {
    await ref
        .read(inventorySaleAllocationControllerProvider.notifier)
        .clearSale(sale.id);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Stock allocation cleared')),
    );
  }

  Future<void> _editLot(SaleAllocationLotViewModel lot) async {
    final purchases = ref.read(purchasesWithStockProvider);

    PurchaseModel? purchase;
    for (final item in purchases) {
      if (item.id == lot.purchaseId) {
        purchase = item;
        break;
      }
    }

    if (purchase == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Purchase lot not found')),
      );
      return;
    }

    final maxQuantity = purchase.remainingQuantity + lot.quantity;

    final result = await showDialog<int>(
      context: context,
      builder: (_) => EditAllocationLotDialog(
        lot: lot,
        maxQuantity: maxQuantity,
      ),
    );

    if (result == null) return;

    final currentAllocation = ref.read(saleAllocationSummaryProvider(sale));
    final quantityWithoutThisLot =
        currentAllocation.allocatedQuantity - lot.quantity;
    final newTotalQuantity = quantityWithoutThisLot + result;

    if (newTotalQuantity > sale.quantity) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Total allocation cannot exceed sale quantity (${sale.quantity})',
          ),
        ),
      );
      return;
    }

    await ref
        .read(inventorySaleAllocationControllerProvider.notifier)
        .updateLotQuantity(
          saleId: sale.id,
          purchaseId: lot.purchaseId,
          quantity: result,
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Allocation lot updated')),
    );
  }

  Future<void> _removeLot(SaleAllocationLotViewModel lot) async {
    await ref.read(inventorySaleAllocationControllerProvider.notifier).removeLot(
          saleId: sale.id,
          purchaseId: lot.purchaseId,
        );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Allocation lot removed')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final linkedPurchase = ref.watch(saleLinkedPurchaseProvider(sale));
    final allocation = ref.watch(saleAllocationSummaryProvider(sale));
    final allocationLots = ref.watch(saleAllocationLotsProvider(sale));
    final allocationValidation =
        ref.watch(saleAllocationValidationProvider(sale));
    final breakdown = ref.watch(saleNetBreakdownProvider(sale));
    final quality = ref.watch(saleQualityScoreProvider(sale));
    final profit = ref.watch(saleProfitProvider(sale));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sale Details'),
        actions: [
          DetailsActionBar(
            onEdit: _openEdit,
            onDelete: _confirmDelete,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                CurrencyFormatter.format(
                  sale.finalNet,
                  currency: sale.currency,
                ),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          FilledButton.tonalIcon(
            onPressed: _duplicate,
            icon: const Icon(Icons.copy_outlined),
            label: const Text('Duplicate Sale'),
          ),
          const SizedBox(height: 16),
          SaleIdentityCard(sale: sale),
          const SizedBox(height: 12),
          SaleAllocationValidationCard(model: allocationValidation),
          const SizedBox(height: 12),
          SaleAllocationSummaryCard(
            model: allocation,
            currency: sale.currency,
            onAllocate: _openAllocateStock,
            onClearAllocation:
                allocation.hasAllocation ? _clearAllocation : null,
          ),
          const SizedBox(height: 12),
          SaleAllocationLotsCard(
            lots: allocationLots,
            onEditLot: _editLot,
            onRemoveLot: _removeLot,
          ),
          const SizedBox(height: 12),
          SalePurchaseLinkCard(
            purchase: linkedPurchase,
            onLink: _openLinkPurchase,
            onUnlink: linkedPurchase == null ? null : _unlinkPurchase,
          ),
          const SizedBox(height: 12),
          SaleProfitCard(
            model: profit,
            currency: sale.currency,
          ),
          const SizedBox(height: 12),
          SaleQualityScoreCard(model: quality),
          const SizedBox(height: 12),
          SaleNetBreakdownCard(
            model: breakdown,
            currency: sale.currency,
          ),
          const SizedBox(height: 12),
          SaleRevenueBreakdownCard(sale: sale),
          const SizedBox(height: 12),
          SaleTimelineCard(sale: sale),
        ],
      ),
    );
  }
}