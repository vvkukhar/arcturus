import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/inventory/presentation/item_form_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchase_form_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sale_form_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_item_form_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class QuickAddSheet extends ConsumerWidget {
  const QuickAddSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

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
              Padding(
                padding: const EdgeInsets.only(left: 16, bottom: 20),
                child: Text(i18n.t('qa.title'), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
              ),
              _Tile(i18n.t('qa.addItem'), Icons.inventory_2_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ItemFormScreen()));
              }),
              _Tile(i18n.t('qa.addPurchase'), Icons.shopping_cart_checkout_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PurchaseFormScreen()));
              }),
              _Tile(i18n.t('qa.addSale'), Icons.sell_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SaleFormScreen()));
              }),
              _Tile(i18n.t('drawer.watchlist'), Icons.visibility_outlined, () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const WatchlistItemFormScreen()));
              }),
              _Tile(i18n.t('qa.openEval'), Icons.local_fire_department_outlined, () {
                Navigator.pop(context);
                Navigator.pushNamed(context, AppRouter.dealEvaluator);
              }),
              _Tile(i18n.t('qa.openCC'), Icons.hub_outlined, () {
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