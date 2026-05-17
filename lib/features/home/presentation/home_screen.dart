import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('home.title'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF059669)]),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(i18n.t('sync.health'), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
                const SizedBox(height: 8),
                const Text('All engines operational. Core synced.', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 24),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.black),
                  onPressed: () => Navigator.pushNamed(context, AppRouter.dashboard),
                  child: Text(i18n.t('home.openDashboard'), style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(i18n.t('cc.trading'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 2.5,
            children: [
              _QuickAction(i18n.t('inv.title'), Icons.inventory_2, AppRouter.inventory, context),
              _QuickAction(i18n.t('cc.analytics'), Icons.analytics, AppRouter.analytics, context),
              _QuickAction(i18n.t('cc.dealEval'), Icons.local_fire_department, AppRouter.dealEvaluator, context),
              _QuickAction(i18n.t('cc.title'), Icons.hub, AppRouter.commandCenter, context),
            ],
          )
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final String title;
  final IconData icon;
  final String route;
  final BuildContext context;
  const _QuickAction(this.title, this.icon, this.route, this.context);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () => Navigator.pushNamed(context, route),
      child: Container(
        decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.blueAccent, size: 20),
            const SizedBox(width: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}