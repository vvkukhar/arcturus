import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_action_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_center_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/dead_stock_action_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/dead_stock_card.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/dead_stock_center_bar.dart';

class DeadStockActionCenterScreen extends ConsumerWidget {
  const DeadStockActionCenterScreen({super.key});

  void _handleAction(BuildContext context, String actionKey) {
    switch (actionKey) {
      case 'critical_reprice':
      case 'warning_review':
      case 'open_inventory_aging':
        Navigator.of(context).pushNamed(AppRouter.inventory);
        break;
    }
  }

  Future<void> _saveReport(WidgetRef ref, int count) async {
    await ref.read(actionReportHelperProvider).save(
          title: 'Dead Stock Center Review',
          note: 'Reviewed $count dead stock items',
        );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final actions = ref.watch(deadStockActionCenterProvider);
    final entries = ref.watch(deadStockEntriesProvider);
    final actionService = ref.watch(deadStockCenterActionProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('deadStock.title')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DeadStockCenterBar(
            onOpenInventory: () {
              Navigator.of(context).pushNamed(AppRouter.inventory);
            },
            onSaveReport: () async {
              await _saveReport(ref, entries.length);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(i18n.t('deadStock.reportSaved'))),
                );
              }
            },
          ),
          const SizedBox(height: 12),
          Text(
            i18n.t('deadStock.recActions'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          ...actions.map(
            (action) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: DeadStockActionCard(
                model: action,
                onTap: () => _handleAction(context, action.actionKey),
              ),
            ),
          ),
          if (actions.isNotEmpty) ...[
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  i18n.t(actionService.description(actions.first.actionKey)),
                ),
              ),
            ),
          ],
          const SizedBox(height: 20),
          Text(
            i18n.t('deadStock.items'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          if (entries.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(i18n.t('deadStock.empty')),
              ),
            )
          else
            ...entries.map(
              (entry) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: DeadStockCard(entry: entry),
              ),
            ),
        ],
      ),
    );
  }
}