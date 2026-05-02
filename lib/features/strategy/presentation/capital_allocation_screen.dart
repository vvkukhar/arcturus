import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/strategy_api_repository_provider.dart';

class CapitalAllocationScreen extends ConsumerStatefulWidget {
  const CapitalAllocationScreen({super.key});

  @override
  ConsumerState<CapitalAllocationScreen> createState() =>
      _CapitalAllocationScreenState();
}

class _CapitalAllocationScreenState
    extends ConsumerState<CapitalAllocationScreen> {
  List<Map<String, dynamic>>? result;
  bool _loading = false;
  String? _error;

  Future<void> run() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final repo = ref.read(strategyApiRepositoryProvider);
      final res = await repo.allocate(
        20000,
        [
          {
            'itemId': '1',
            'title': 'Test item',
            'buyPrice': 1000,
            'expectedNetProfit': 300,
            'roiPercent': 30,
            'liquidityScore': 0.7,
            'confidenceScore': 0.8,
            'strategy': 'quick_flip',
          },
        ],
      );

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Capital Allocation'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loading ? null : run,
        child: _loading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : const Icon(Icons.play_arrow),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : result == null
                  ? const Center(child: Text('Run allocation'))
                  : ListView(
                      padding: const EdgeInsets.all(16),
                      children: result!
                          .map(
                            (e) => Card(
                              child: ListTile(
                                title: Text(e['title']?.toString() ?? '-'),
                                subtitle: Text(
                                  'units ${e['units']} • ${e['reservedCapital']}',
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
    );
  }
}