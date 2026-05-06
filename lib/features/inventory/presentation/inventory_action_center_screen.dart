import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_center_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_executor_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_hub_provider.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_action_center_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_action_hub_card.dart';

class InventoryActionCenterScreen extends ConsumerWidget {
  const InventoryActionCenterScreen({super.key});

  void _handleAction(BuildContext context, WidgetRef ref, String actionKey) {
    final executor = ref.read(inventoryActionExecutorProvider);
    final route = executor.routeFor(actionKey);
    executor.applyLocalAction(actionKey);

    if (route != null) {
      Navigator.of(context).pushNamed(route);
      return;
    }

    Navigator.of(context).pushNamed(AppRouter.inventory);
  }

  Future<void> _saveReport(WidgetRef ref, int count) async {
    await ref.read(actionReportHelperProvider).save(
          title: 'Inventory Action Center Review',
          note: 'Reviewed $count inventory action entries',
        );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final entries = ref.watch(inventoryActionHubProvider);
    final service = ref.watch(inventoryActionCenterActionProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Inventory Action Center')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          InventoryActionCenterBar(
            onOpenInventory: () {
              Navigator.of(context).pushNamed(AppRouter.inventory);
            },
            onSaveReport: () async {
              await _saveReport(ref, entries.length);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(i18n.t('Inventory action report saved')),
                  ),
                );
              }
            },
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                i18n.t('This screen collects the most useful trading actions in one place.'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          ...entries.map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: InventoryActionHubCard(
                entry: entry,
                onTap: () => _handleAction(context, ref, entry.actionKey),
              ),
            ),
          ),
          if (entries.isNotEmpty) ...[
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  i18n.t(service.description(entries.first.actionKey)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}