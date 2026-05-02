import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rate_sync_provider.dart';
import 'package:lego_trading_manager/app/providers/official_rates_loader_provider.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';
import 'package:lego_trading_manager/features/settings/application/currency_code_list.dart';

class CurrencySettingsScreen extends ConsumerStatefulWidget {
  const CurrencySettingsScreen({super.key});

  @override
  ConsumerState<CurrencySettingsScreen> createState() =>
      _CurrencySettingsScreenState();
}

class _CurrencySettingsScreenState
    extends ConsumerState<CurrencySettingsScreen> {
  bool _loading = true;
  bool _syncing = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(_load);
  }

  Future<void> _load() async {
    await ref.read(appSettingsControllerProvider.notifier).load();
    if (!mounted) return;
    setState(() {
      _loading = false;
    });
  }

  Future<void> _sync() async {
    setState(() => _syncing = true);

    try {
      await ref.read(officialRateSyncServiceProvider).sync();

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('NBU rates synced')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sync failed: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _syncing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(appSettingsControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency Settings'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : FutureBuilder(
              future: ref.read(officialRatesLoaderServiceProvider).load(),
              builder: (context, snapshot) {
                final rates = snapshot.data ?? const [];

                return ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Base Currency',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 12),
                            DropdownButtonFormField<String>(
                              value: settings.baseCurrency,
                              decoration: const InputDecoration(
                                labelText: 'Base currency',
                              ),
                              items: CurrencyCodeList.common
                                  .map(
                                    (item) => DropdownMenuItem<String>(
                                      value: item,
                                      child: Text(item),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) async {
                                if (value == null) return;
                                await ref
                                    .read(
                                      appSettingsControllerProvider.notifier,
                                    )
                                    .update(baseCurrency: value);
                              },
                            ),
                            const SizedBox(height: 12),
                            SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Use official NBU rates'),
                              value: settings.useOfficialNbuRates,
                              onChanged: (value) async {
                                await ref
                                    .read(
                                      appSettingsControllerProvider.notifier,
                                    )
                                    .update(useOfficialNbuRates: value);
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: _syncing ? null : _sync,
                      icon: const Icon(Icons.sync),
                      label: Text(_syncing ? 'Syncing...' : 'Sync NBU Now'),
                    ),
                    const SizedBox(height: 16),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: rates.isEmpty
                            ? const Text('No official rates cached yet.')
                            : Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Cached Official Rates',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  ...rates.take(20).map(
                                        (rate) => Padding(
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 6,
                                          ),
                                          child: Row(
                                            children: [
                                              SizedBox(
                                                width: 60,
                                                child: Text(
                                                  rate.code,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.w700,
                                                  ),
                                                ),
                                              ),
                                              Expanded(
                                                child: Text(rate.name ?? '-'),
                                              ),
                                              Text(
                                                rate.rate.toStringAsFixed(4),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                ],
                              ),
                      ),
                    ),
                  ],
                );
              },
            ),
    );
  }
}