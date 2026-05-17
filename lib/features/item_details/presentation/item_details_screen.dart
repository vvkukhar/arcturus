import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/inventory/presentation/item_form_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

class ItemDetailsScreen extends ConsumerWidget {
  final InventoryItemModel item;
  const ItemDetailsScreen({super.key, required this.item});

  void _showQr(BuildContext context, I18nNotifier i18n) {
    final qrData = item.item?.setNumber != null && item.item!.setNumber!.isNotEmpty ? item.item!.setNumber! : item.id;
    
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text(i18n.t('inv.qrCode'), style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            QrImageView(
              data: qrData,
              version: QrVersions.auto,
              size: 250.0,
              backgroundColor: Colors.white,
            ),
            const SizedBox(height: 16),
            Text(item.titleSnapshot, textAlign: TextAlign.center, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
            Text(i18n.t('inv.scanQrToFind'), textAlign: TextAlign.center, style: const TextStyle(color: Colors.black54, fontSize: 12)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close', style: TextStyle(color: Colors.blueAccent))),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expectedSalePrice = item.expectedSalePriceManual ?? item.totalCost;
    final expectedProfit = expectedSalePrice - item.totalCost;
    final margin = expectedSalePrice <= 0 ? 0.0 : (expectedProfit / expectedSalePrice) * 100;
    final roi = item.totalCost <= 0 ? 0.0 : (expectedProfit / item.totalCost) * 100;
    final daysInInv = DateTime.now().difference(item.createdAt).inDays;
    
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('inv.details'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code, color: Colors.white),
            onPressed: () => _showQr(context, i18n),
          ),
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ItemFormScreen(item: item))),
          ),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.titleSnapshot, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900), maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8, runSpacing: 8,
                  children: [
                    _Badge(i18n.t('type.${item.item?.kind.name ?? 'unknown'}').toUpperCase(), Colors.blue),
                    _Badge(i18n.t(item.status.name).toUpperCase(), Colors.orange),
                    if (item.item?.theme != null) _Badge(item.item!.theme!, Colors.purple),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(i18n.t('form.financials'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12, mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _InsightCard(i18n.t('inv.expectedProfit'), expectedProfit.toStringAsFixed(2), expectedProfit >= 0 ? Colors.green : Colors.red),
              _InsightCard('ROI', '${roi.toStringAsFixed(1)}%', roi >= 0 ? Colors.green : Colors.red),
              _InsightCard('Margin', '${margin.toStringAsFixed(1)}%', margin >= 0 ? Colors.green : Colors.red),
              _InsightCard(i18n.t('inv.daysInInv'), daysInInv.toString(), Colors.blueAccent),
            ],
          ),
          const SizedBox(height: 16),
          Text(i18n.t('form.coreDetails'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                _InfoRow(i18n.t('inv.totalCost'), item.totalCost.toStringAsFixed(2)),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow(i18n.t('form.expectedSale'), expectedSalePrice.toStringAsFixed(2)),
                const Divider(height: 24, color: Colors.white10),
                _InfoRow(i18n.t('form.condition'), i18n.t('cond.${item.condition.name.replaceAll('ItemCondition.', '')}')),
                if (item.storageLocationId != null && item.storageLocationId!.isNotEmpty) ...[
                  const Divider(height: 24, color: Colors.white10),
                  _InfoRow(i18n.t('form.location'), item.storageLocationId!),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color color;
  const _Badge(this.text, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
    );
  }
}

class _InsightCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  const _InsightCard(this.title, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: color.withValues(alpha: 0.2))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Flexible(child: Text(title, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis)),
          const SizedBox(height: 4),
          Flexible(child: Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900), maxLines: 1, overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(child: Text(label, style: const TextStyle(color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis)),
        const SizedBox(width: 8),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
      ],
    );
  }
}