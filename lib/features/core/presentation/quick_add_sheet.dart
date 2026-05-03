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
              padding: EdgeInsets.only(bottom: 8),
              child: Text(
                'Quick Add / Open',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            _tile(
              context,
              title: 'Add Item',
              icon: Icons.inventory_2_outlined,
              route: AppRouter.addItem,
            ),
            _tile(
              context,
              title: 'Add Purchase',
              icon: Icons.shopping_cart_checkout_outlined,
              route: AppRouter.addPurchase,
            ),
            _tile(
              context,
              title: 'Add Sale',
              icon: Icons.sell_outlined,
              route: AppRouter.addSale,
            ),
            _tile(
              context,
              title: 'Open Opportunity Center',
              icon: Icons.tips_and_updates_outlined,
              route: AppRouter.opportunityCenter,
            ),
            _tile(
              context,
              title: 'Open Dead Stock Center',
              icon: Icons.warning_amber_outlined,
              route: AppRouter.deadStockCenter,
            ),
            _tile(
              context,
              title: 'Open Deal Evaluator',
              icon: Icons.local_fire_department_outlined,
              route: AppRouter.dealEvaluator,
            ),
            _tile(
              context,
              title: 'Open Command Center',
              icon: Icons.hub_outlined,
              route: AppRouter.commandCenter,
            ),
          ],
        ),
      ),
    );
  }

  Widget _tile(
    BuildContext context, {
    required String title,
    required IconData icon,
    required String route,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: const Icon(Icons.arrow_forward),
      onTap: () {
        Navigator.of(context).pop();
        Navigator.of(context).pushNamed(route);
      },
    );
  }
}