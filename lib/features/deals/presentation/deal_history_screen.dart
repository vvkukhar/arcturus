import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deals_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/trading/presentation/quick_buy_dialog.dart';
import 'package:url_launcher/url_launcher.dart';

class DealHistoryScreen extends ConsumerWidget {
  const DealHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(dealsEngineProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('PRO Deals Radar', style: TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.blueAccent),
            onPressed: () => ref.invalidate(dealsEngineProvider),
          )
        ],
      ),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (deals) {
          if (deals.isEmpty) return const Center(child: Text('No active deals found.', style: TextStyle(color: Colors.white54)));

          return ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: deals.length,
            itemBuilder: (context, index) {
              final deal = deals[index];
              return Card(
                color: const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.indigoAccent.withValues(alpha: 0.3))),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(deal.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), maxLines: 2, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Buy Price', style: TextStyle(color: Colors.white54, fontSize: 10)),
                              Text('${deal.askingPrice} ₴', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text('Est. Profit', style: TextStyle(color: Colors.greenAccent, fontSize: 10)),
                              Text('+${deal.expectedProfit} ₴', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Colors.greenAccent)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton.icon(
                          onPressed: () async {
                            final url = await showDialog<String>(
                              context: context,
                              builder: (_) => QuickBuyDialog(listingId: deal.id, title: deal.title, price: deal.askingPrice),
                            );
                            if (url != null && await canLaunchUrl(Uri.parse(url))) {
                              await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
                            }
                          },
                          icon: const Icon(Icons.bolt),
                          label: const Text('1-Click Execute'),
                          style: FilledButton.styleFrom(backgroundColor: Colors.indigoAccent),
                        ),
                      )
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}