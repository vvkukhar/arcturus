import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_integrity_cleanup_service.dart';
import 'package:lego_trading_manager/core/storage/app_data_integrity_provider.dart';

class AppDataIntegrityCard extends ConsumerStatefulWidget {
  const AppDataIntegrityCard({super.key});

  @override
  ConsumerState<AppDataIntegrityCard> createState() =>
      _AppDataIntegrityCardState();
}

class _AppDataIntegrityCardState extends ConsumerState<AppDataIntegrityCard> {
  bool _busy = false;
  String? _lastCleanupReport;

  Widget _row(String label, int value, {bool warning = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value.toString(),
            style: TextStyle(
              fontWeight: FontWeight.w900,
              color: warning && value > 0 ? Colors.orange : null,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _cleanup() async {
    setState(() {
      _busy = true;
      _lastCleanupReport = null;
    });

    try {
      final report =
          await ref.read(appDataIntegrityCleanupServiceProvider).cleanup();

      if (!mounted) return;

      setState(() {
        _lastCleanupReport = report.summary;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(report.summary)),
      );
    } catch (error) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cleanup failed: $error')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _busy = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final integrity = ref.watch(appDataIntegrityProvider);

    final color = integrity.isHealthy ? Colors.green : Colors.orange;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  integrity.isHealthy
                      ? Icons.verified_outlined
                      : Icons.warning_amber_outlined,
                  color: color,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    integrity.isHealthy
                        ? 'Data Integrity Healthy'
                        : 'Data Integrity Needs Review',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _row('Purchases', integrity.purchasesCount),
            _row('Sales', integrity.salesCount),
            _row('Allocations', integrity.allocationsCount),
            _row('Sale-purchase links', integrity.linksCount),
            const Divider(),
            _row(
              'Orphan allocations',
              integrity.orphanAllocationsCount,
              warning: true,
            ),
            _row(
              'Orphan links',
              integrity.orphanLinksCount,
              warning: true,
            ),
            _row(
              'Overallocated sales',
              integrity.overAllocatedSalesCount,
              warning: true,
            ),
            _row(
              'Oversold purchases',
              integrity.overSoldPurchasesCount,
              warning: true,
            ),
            if (!integrity.isHealthy) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: _busy ? null : _cleanup,
                  icon: const Icon(Icons.cleaning_services_outlined),
                  label: const Text('Cleanup Integrity Issues'),
                ),
              ),
            ],
            if (_lastCleanupReport != null) ...[
              const SizedBox(height: 12),
              Text(
                _lastCleanupReport!,
                style: const TextStyle(
                  color: Colors.white70,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
            if (_busy) ...[
              const SizedBox(height: 12),
              const LinearProgressIndicator(),
            ],
          ],
        ),
      ),
    );
  }
}