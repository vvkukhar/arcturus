import 'package:flutter/material.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';

class QuickAddSheet extends StatelessWidget {
  const QuickAddSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Wrap(
          runSpacing: 8,
          children: [
            const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: Text('Quick Create', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            ),
            _Tile('Add Item', Icons.inventory_2_outlined, AppRouter.inventory, context),
            _Tile('Add Purchase', Icons.shopping_cart_checkout_outlined, AppRouter.purchases, context),
            _Tile('Add Sale', Icons.sell_outlined, AppRouter.sales, context),
            _Tile('Deal Evaluator', Icons.local_fire_department_outlined, AppRouter.dealEvaluator, context),
            _Tile('Command Center', Icons.hub_outlined, AppRouter.commandCenter, context),
          ],
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  final String title;
  final IconData icon;
  final String route;
  final BuildContext context;
  const _Tile(this.title, this.icon, this.route, this.context);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      trailing: const Icon(Icons.arrow_forward),
      onTap: () {
        Navigator.pop(context);
        Navigator.pushNamed(context, route);
      },
    );
  }
}