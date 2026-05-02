import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/csv_builder.dart';
import 'package:lego_trading_manager/core/utils/file_exporter.dart';
import 'package:lego_trading_manager/core/utils/json_builder.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_export_row_mapper.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_export_row_mapper.dart';
import 'package:lego_trading_manager/features/sales/application/sales_export_row_mapper.dart';
import 'package:lego_trading_manager/features/settings/application/backup_health_provider.dart';
import 'package:lego_trading_manager/features/settings/application/export_bundle_provider.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/backup_health_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/export_bundle_card.dart';

class ExportScreen extends ConsumerWidget {
  const ExportScreen({super.key});

  Future<void> _exportInventoryJson(BuildContext context) async {
    final items =
        InventoryRepository().getAllItems().map((e) => e.toMap()).toList();
    final json = JsonBuilder.build(items);
    await FileExporter.exportText(filename: 'inventory.json', content: json);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Inventory JSON prepared')),
      );
    }
  }

  Future<void> _exportSalesJson(BuildContext context) async {
    final sales =
        SalesRepository().getAllSales().map((e) => e.toMap()).toList();
    final json = JsonBuilder.build(sales);
    await FileExporter.exportText(filename: 'sales.json', content: json);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sales JSON prepared')),
      );
    }
  }

  Future<void> _exportPurchasesJson(BuildContext context) async {
    final purchases =
        PurchasesRepository().getAllPurchases().map((e) => e.toMap()).toList();
    final json = JsonBuilder.build(purchases);
    await FileExporter.exportText(filename: 'purchases.json', content: json);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Purchases JSON prepared')),
      );
    }
  }

  Future<void> _exportInventoryCsv(BuildContext context) async {
    final rows = <List<String>>[
      [
        'id',
        'title',
        'type',
        'theme',
        'subtheme',
        'legoNumber',
        'cost',
        'marketAverage',
        'status',
      ],
      ...InventoryRepository().getAllItems().map(InventoryExportRowMapper.map),
    ];

    final csv = CsvBuilder.build(rows);
    await FileExporter.exportText(filename: 'inventory.csv', content: csv);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Inventory CSV prepared')),
      );
    }
  }

  Future<void> _exportSalesCsv(BuildContext context) async {
    final rows = <List<String>>[
      [
        'id',
        'itemId',
        'platform',
        'buyerName',
        'salePrice',
        'platformFee',
        'shippingByMe',
        'finalNet',
        'saleDate',
      ],
      ...SalesRepository().getAllSales().map(SalesExportRowMapper.map),
    ];

    final csv = CsvBuilder.build(rows);
    await FileExporter.exportText(filename: 'sales.csv', content: csv);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sales CSV prepared')),
      );
    }
  }

  Future<void> _exportPurchasesCsv(BuildContext context) async {
    final rows = <List<String>>[
      [
        'id',
        'itemId',
        'source',
        'purchasePrice',
        'shippingCost',
        'additionalCosts',
        'finalTotal',
        'currency',
        'purchaseDate',
      ],
      ...PurchasesRepository()
          .getAllPurchases()
          .map(PurchasesExportRowMapper.map),
    ];

    final csv = CsvBuilder.build(rows);
    await FileExporter.exportText(filename: 'purchases.csv', content: csv);

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Purchases CSV prepared')),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final backupHealth = ref.watch(backupHealthProvider);
    final bundles = ref.watch(exportBundleProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Export'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          BackupHealthCard(model: backupHealth),
          const SizedBox(height: 12),
          const Text(
            'Bundles Overview',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          ...bundles.map(
            (bundle) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: ExportBundleCard(bundle: bundle),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: const Text('Export Inventory JSON'),
              onTap: () => _exportInventoryJson(context),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Export Sales JSON'),
              onTap: () => _exportSalesJson(context),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Export Purchases JSON'),
              onTap: () => _exportPurchasesJson(context),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Export Inventory CSV'),
              onTap: () => _exportInventoryCsv(context),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Export Sales CSV'),
              onTap: () => _exportSalesCsv(context),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('Export Purchases CSV'),
              onTap: () => _exportPurchasesCsv(context),
            ),
          ),
        ],
      ),
    );
  }
}