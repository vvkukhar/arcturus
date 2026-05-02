import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/strategy_api_repository_provider.dart';

class ProfitScreen extends ConsumerStatefulWidget {
  const ProfitScreen({super.key});

  @override
  ConsumerState<ProfitScreen> createState() => _ProfitScreenState();
}

class _ProfitScreenState extends ConsumerState<ProfitScreen> {
  Map<String, dynamic>? result;
  bool _loading = false;
  String? _error;

  Future<void> run() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final repo = ref.read(strategyApiRepositoryProvider);
      final res = await repo.profit([
        {
          'buyCost': 1000,
          'sellRevenue': 1500,
          'fees': 150,
          'shipping': 50,
          'packaging': 20,
        },
      ]);

      if (!mounted) return;
      setState(() {
        result = res;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Widget _row(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value?.toString() ?? '-',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = result;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profit Tracker'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loading ? null : run,
        child: _loading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : const Icon(Icons.calculate),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : data == null
                  ? const Center(child: Text('Run profit calc'))
                  : Padding(
                      padding: const EdgeInsets.all(16),
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: data.entries
                                .map((entry) => _row(entry.key, entry.value))
                                .toList(),
                          ),
                        ),
                      ),
                    ),
    );
  }
}