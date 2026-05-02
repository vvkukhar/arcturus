import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rate_sync_provider.dart';
import 'package:lego_trading_manager/app/providers/official_rates_loader_provider.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/currency_rate_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/nbu_api_note_card.dart';

class CurrencyRatesScreen extends ConsumerStatefulWidget {
  const CurrencyRatesScreen({super.key});

  @override
  ConsumerState<CurrencyRatesScreen> createState() =>
      _CurrencyRatesScreenState();
}

class _CurrencyRatesScreenState extends ConsumerState<CurrencyRatesScreen> {
  List<CurrencyRateModel> _rates = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final data = await ref.read(officialRatesLoaderServiceProvider).load();

    if (!mounted) return;
    setState(() {
      _rates = data;
      _loading = false;
    });
  }

  Future<void> _sync() async {
    setState(() => _loading = true);

    try {
      final data = await ref.read(officialRateSyncServiceProvider).sync();

      if (!mounted) return;
      setState(() {
        _rates = data;
        _loading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Official rates synced')),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sync failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Official Rates'),
        actions: [
          IconButton(
            onPressed: _loading ? null : _sync,
            icon: const Icon(Icons.sync),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _rates.isEmpty
              ? ListView(
                  padding: const EdgeInsets.all(16),
                  children: const [
                    NbuApiNoteCard(),
                    SizedBox(height: 16),
                    Center(child: Text('No official rates cached yet.')),
                  ],
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _rates.length + 1,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    if (index == 0) return const NbuApiNoteCard();
                    return CurrencyRateCard(rate: _rates[index - 1]);
                  },
                ),
    );
  }
}