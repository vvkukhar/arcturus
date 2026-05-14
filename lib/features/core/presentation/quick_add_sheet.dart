import 'package:flutter/material.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/inventory/presentation/item_form_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchase_form_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sale_form_screen.dart';

class QuickAddSheet extends StatelessWidget {
  const QuickAddSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF171A21),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 16, bottom: 20),
                child: Text('Quick Create', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
              ),
              _Tile('Add Item', Icons.inventory_2_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ItemFormScreen()));
              }),
              _Tile('Add Purchase', Icons.shopping_cart_checkout_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PurchaseFormScreen()));
              }),
              _Tile('Add Sale', Icons.sell_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SaleFormScreen()));
              }),
              _Tile('Deal Evaluator', Icons.local_fire_department_outlined, () {
                Navigator.pop(context);
                Navigator.pushNamed(context, AppRouter.dealEvaluator);
              }),
              _Tile('Command Center', Icons.hub_outlined, () {
                Navigator.pop(context);
                Navigator.pushNamed(context, AppRouter.commandCenter);
              }),
            ],
          ),
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  
  const _Tile(this.title, this.icon, this.onTap);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: Colors.white70),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      trailing: const Icon(Icons.arrow_forward, color: Colors.white30),
      onTap: onTap,
    );
  }
}