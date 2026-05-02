import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/details_action_bar.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_duplicate_service.dart';
import 'package:lego_trading_manager/features/purchases/presentation/edit_purchase_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_cost_breakdown_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_identity_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_inventory_flow_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_payment_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_source_card.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_timeline_card.dart';

class PurchaseDetailsScreen extends ConsumerStatefulWidget {
  final PurchaseModel purchase;

  const PurchaseDetailsScreen({
    super.key,
    required this.purchase,
  });

  @override
  ConsumerState<PurchaseDetailsScreen> createState() =>
      _PurchaseDetailsScreenState();
}

class _PurchaseDetailsScreenState extends ConsumerState<PurchaseDetailsScreen> {
  late PurchaseModel purchase;

  @override
  void initState() {
    super.initState();
    purchase = widget.purchase;
  }

  PurchaseModel _currentPurchaseWithStock() {
    final purchases = ref.watch(purchasesWithStockProvider);

    for (final item in purchases) {
      if (item.id == purchase.id) {
        return item;
      }
    }

    return purchase;
  }

  Future<void> _openEdit(PurchaseModel current) async {
    final result = await Navigator.of(context).push<PurchaseModel>(
      MaterialPageRoute(
        builder: (_) => EditPurchaseScreen(purchase: current),
      ),
    );

    if (result == null) return;

    setState(() {
      purchase = result;
    });

    if (!mounted) return;

    Navigator.of(context).pop({
      'updated': result,
    });
  }

  Future<void> _confirmDelete(PurchaseModel current) async {
    if (current.soldQuantity > 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cannot delete purchase with allocated/sold quantity'),
        ),
      );
      return;
    }

    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Delete purchase'),
          content: const Text('Delete this purchase record?'),
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

    if (!mounted) return;

    Navigator.of(context).pop({
      'deleted': true,
      'id': current.id,
    });
  }

  void _duplicate(PurchaseModel current) {
    final duplicated = const PurchaseDuplicateService().duplicate(current);

    Navigator.of(context).pop({
      'duplicated': duplicated,
    });
  }

  @override
  Widget build(BuildContext context) {
    final current = _currentPurchaseWithStock();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchase Details'),
        actions: [
          DetailsActionBar(
            onEdit: () => _openEdit(current),
            onDelete: () => _confirmDelete(current),
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
                  current.finalTotal,
                  currency: current.currency,
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
            onPressed: () => _duplicate(current),
            icon: const Icon(Icons.copy_outlined),
            label: const Text('Duplicate Purchase'),
          ),
          const SizedBox(height: 16),
          PurchaseIdentityCard(purchase: current),
          const SizedBox(height: 12),
          PurchaseInventoryFlowCard(purchase: current),
          const SizedBox(height: 12),
          PurchaseCostBreakdownCard(purchase: current),
          const SizedBox(height: 12),
          PurchasePaymentCard(purchase: current),
          const SizedBox(height: 12),
          PurchaseSourceCard(purchase: current),
          const SizedBox(height: 12),
          PurchaseTimelineCard(purchase: current),
        ],
      ),
    );
  }
}