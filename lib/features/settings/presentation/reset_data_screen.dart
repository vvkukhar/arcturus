import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/storage_sync_provider.dart';
import 'package:lego_trading_manager/data/store/inventory_memory_store.dart';
import 'package:lego_trading_manager/data/store/market_memory_store.dart';
import 'package:lego_trading_manager/data/store/partout_memory_store.dart';
import 'package:lego_trading_manager/data/store/purchases_memory_store.dart';
import 'package:lego_trading_manager/data/store/sales_memory_store.dart';
import 'package:lego_trading_manager/data/store/watchlist_memory_store.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/settings_info_banner.dart';

class ResetDataScreen extends ConsumerWidget {
  const ResetDataScreen({super.key});

  Future<void> _reset(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Clear everything'),
          content: const Text(
            'This will remove inventory, purchases, sales, watchlist, market and part-out data.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Clear'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) return;

    InventoryMemoryStore.clear();
    PurchasesMemoryStore.clear();
    SalesMemoryStore.clear();
    WatchlistMemoryStore.clear();
    MarketMemoryStore.clear();
    PartOutMemoryStore.clear();

    await ref.read(storageSyncRepositoryProvider).clearAll();

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All data cleared')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reset Data'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SettingsInfoBanner(
            title: 'Danger Zone',
            subtitle:
                'This action removes all local app data and cannot be undone.',
            icon: Icons.warning_amber_outlined,
          ),
          const SizedBox(height: 16),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'This will remove inventory, purchases, sales, watchlist, market snapshots and part-out data.',
              ),
            ),
          ),
          const SizedBox(height: 16),
          FilledButton.tonalIcon(
            onPressed: () => _reset(context, ref),
            icon: const Icon(Icons.delete_forever_outlined),
            label: const Text('Clear Everything'),
          ),
        ],
      ),
    );
  }
}