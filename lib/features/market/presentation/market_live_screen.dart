import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

final liveListingsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final network = ref.read(networkCoreProvider);
  if (!await network.isOnline()) throw Exception('Offline. Cannot fetch live market data.');
  try {
    final res = await network.request('GET', '/scanner/listings?limit=100');
    return res is List ? res : [];
  } catch (e) { throw Exception('Failed to load listings: $e'); }
});

class MarketLiveScreen extends ConsumerWidget {
  const MarketLiveScreen({super.key});

  Future<void> _launchUrl(String urlString) async {
    final url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listingsAsync = ref.watch(liveListingsProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('market.liveData'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(liveListingsProvider),
          )
        ],
      ),
      body: listingsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (listings) {
          if (listings.isEmpty) {
            return Center(
              child: Text(
                i18n.t('market.noRawData'),
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white54, fontSize: 16),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            physics: const BouncingScrollPhysics(),
            itemCount: listings.length,
            itemBuilder: (context, index) {
              final listing = listings[index];
              final price = listing['price']?.toString() ?? '0';
              final currency = listing['currency'] ?? 'UAH';
              final sourceCode = listing['sourceCode']?.toString().toUpperCase() ?? 'UNKNOWN';
              final condition = listing['condition'] ?? 'unknown';
              final isSealed = listing['sealed'] == true;
              final isStale = listing['status'] == 'stale';

              return Card(
                color: isStale ? const Color(0xFF171A21).withOpacity(0.5) : const Color(0xFF171A21),
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: isStale ? Colors.transparent : Colors.blueAccent.withOpacity(0.1)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              listing['titleRaw'] ?? 'No Title',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: isStale ? Colors.white54 : Colors.white,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.purpleAccent.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              sourceCode,
                              style: const TextStyle(color: Colors.purpleAccent, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '$price $currency',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w900,
                                  color: isStale ? Colors.white30 : Colors.greenAccent,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  if (isSealed)
                                    Container(
                                      margin: const EdgeInsets.only(right: 8),
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(color: Colors.blueAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                                      child: Text(i18n.t('market.sealed'), style: const TextStyle(fontSize: 10, color: Colors.blueAccent)),
                                    ),
                                  Text(
                                    '${i18n.t('market.condition')}: $condition',
                                    style: const TextStyle(color: Colors.white54, fontSize: 12),
                                  ),
                                ],
                              )
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.open_in_new, color: Colors.blueAccent),
                            onPressed: () {
                              if (listing['url'] != null) {
                                _launchUrl(listing['url']);
                              }
                            },
                          ),
                        ],
                      ),
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