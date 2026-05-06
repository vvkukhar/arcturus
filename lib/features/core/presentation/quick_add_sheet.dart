import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class QuickAddSheet extends ConsumerWidget {
  const QuickAddSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Wrap(
          runSpacing: 8,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                i18n.t('qa.title'),
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            _tile(
              context,
              title: i18n.t('qa.addItem'),
              icon: Icons.inventory_2_outlined,
              route: AppRouter.addItem,
            ),
            _tile(
              context,
              title: i18n.t('qa.addPurchase'),
              icon: Icons.shopping_cart_checkout_outlined,
              route: AppRouter.addPurchase,
            ),
            _tile(
              context,
              title: i18n.t('qa.addSale'),
              icon: Icons.sell_outlined,
              route: AppRouter.addSale,
            ),
            _tile(
              context,
              title: i18n.t('qa.openOpp'),
              icon: Icons.tips_and_updates_outlined,
              route: AppRouter.opportunityCenter,
            ),
            _tile(
              context,
              title: i18n.t('qa.openDead'),
              icon: Icons.warning_amber_outlined,
              route: AppRouter.deadStockCenter,
            ),
            _tile(
              context,
              title: i18n.t('qa.openEval'),
              icon: Icons.local_fire_department_outlined,
              route: AppRouter.dealEvaluator,
            ),
            _tile(
              context,
              title: i18n.t('qa.openCC'),
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