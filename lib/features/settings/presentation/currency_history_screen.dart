import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/conversion_history_provider.dart';
import 'package:lego_trading_manager/app/providers/rate_sync_log_provider.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/conversion_history_card.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/rate_sync_log_card.dart';

class CurrencyHistoryScreen extends ConsumerStatefulWidget {
  const CurrencyHistoryScreen({super.key});

  @override
  ConsumerState<CurrencyHistoryScreen> createState() =>
      _CurrencyHistoryScreenState();
}

class _CurrencyHistoryScreenState extends ConsumerState<CurrencyHistoryScreen> {
  List<dynamic> _history = [];
  List<dynamic> _logs = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    Future.microtask(_load);
  }

  Future<void> _load() async {
    final history = await ref.read(conversionHistoryServiceProvider).getAll();
    final logs = await ref.read(rateSyncLogServiceProvider).getAll();

    if (!mounted) return;
    setState(() {
      _history = history;
      _logs = logs;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency History'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const Text(
                  'Rate Sync Logs',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 12),
                if (_logs.isEmpty)
                  const Card(child: ListTile(title: Text('No sync logs yet')))
                else
                  ..._logs.map((e) => RateSyncLogCard(log: e)),
                const SizedBox(height: 24),
                const Text(
                  'Conversion History',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 12),
                if (_history.isEmpty)
                  const Card(child: ListTile(title: Text('No conversions yet')))
                else
                  ..._history.map((e) => ConversionHistoryCard(item: e)),
              ],
            ),
    );
  }
}