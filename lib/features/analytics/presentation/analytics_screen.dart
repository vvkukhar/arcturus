import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_engine.dart';

class AnalyticsScreen extends ConsumerWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(analyticsEngineProvider);
    final engine = ref.read(analyticsEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Analytics Center', style: TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (state) => CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFinancialSummary(state),
                    const SizedBox(height: 24),
                    _buildRecommendations(state.recommendations),
                    const SizedBox(height: 24),
                    _buildRepriceSection(state.repriceSuggestions, engine),
                    const SizedBox(height: 24),
                    _buildDistributions(state),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildFinancialSummary(AnalyticsEngineState state) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          _StatRow(label: 'Total Net Profit', value: state.totalNetProfit.toStringAsFixed(2), isPositive: state.totalNetProfit >= 0),
          const Divider(height: 24, color: Colors.white10),
          _StatRow(label: 'Total Revenue', value: state.totalSoldRevenue.toStringAsFixed(2)),
          _StatRow(label: 'Total Invested', value: state.totalInvested.toStringAsFixed(2)),
          _StatRow(label: 'Inventory Value', value: state.inventoryValue.toStringAsFixed(2)),
          _StatRow(label: 'Frozen Capital', value: state.frozenCapital.toStringAsFixed(2)),
          const Divider(height: 24, color: Colors.white10),
          _StatRow(label: 'Average ROI', value: '${state.averageRoi.toStringAsFixed(1)}%', isPositive: state.averageRoi >= 0),
          _StatRow(label: 'Average Margin', value: '${state.averageMargin.toStringAsFixed(1)}%'),
        ],
      ),
    );
  }

  Widget _buildRecommendations(List<SmartRecommendation> recs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Smart Recommendations', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...recs.map((r) {
          final color = r.severity == 'good' ? Colors.green : r.severity == 'warning' ? Colors.orange : r.severity == 'danger' ? Colors.red : Colors.blueGrey;
          return Card(
            color: color.withValues(alpha: 0.1),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: color.withValues(alpha: 0.3))),
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: Icon(Icons.tips_and_updates, color: color),
              title: Text(r.title, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(r.message),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildRepriceSection(List<RepriceSuggestion> suggestions, AnalyticsEngine engine) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Repricing Opportunities', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            if (suggestions.isNotEmpty)
              TextButton.icon(
                onPressed: () => engine.applyMarketRepriceToAll(),
                icon: const Icon(Icons.auto_fix_high, size: 16),
                label: const Text('Apply 98% to All'),
              )
          ],
        ),
        const SizedBox(height: 12),
        if (suggestions.isEmpty)
          const Text('No repricing needed. Prices are perfectly aligned with the market.', style: TextStyle(color: Colors.white54)),
        ...suggestions.take(5).map((s) {
          final isPositive = s.suggested >= s.current;
          final color = isPositive ? Colors.green : Colors.orange;
          return Card(
            color: const Color(0xFF171A21),
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              title: Text(s.title, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Current: ${s.current.toStringAsFixed(0)} → Suggested: ${s.suggested.toStringAsFixed(0)}'),
              trailing: IconButton(
                icon: Icon(Icons.check_circle, color: color),
                onPressed: () => engine.applyRepriceSuggestion(s.itemId, s.suggested),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildDistributions(AnalyticsEngineState state) {
    return Column(
      children: [
        _buildBreakdownSection('Capital Allocation', state.capitalAllocation),
        const SizedBox(height: 24),
        _buildBreakdownSection('Velocity (Days Active)', state.velocityBuckets.map((k, v) => MapEntry(k, v.toDouble()))),
        const SizedBox(height: 24),
        _buildBreakdownSection('Profit Bands (Sold)', state.profitBands.map((k, v) => MapEntry(k, v.toDouble()))),
      ],
    );
  }

  Widget _buildBreakdownSection(String title, Map<String, double> data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
          child: Column(
            children: data.entries.map((e) => ListTile(
              title: Text(e.key, style: const TextStyle(fontSize: 14)),
              trailing: Text(e.value.toStringAsFixed(e.value.truncateToDouble() == e.value ? 0 : 2), style: const TextStyle(fontWeight: FontWeight.bold)),
            )).toList(),
          ),
        )
      ],
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label, value;
  final bool? isPositive;

  const _StatRow({required this.label, required this.value, this.isPositive});

  @override
  Widget build(BuildContext context) {
    final color = isPositive == null ? Colors.white : (isPositive! ? Colors.greenAccent : Colors.redAccent);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white70)),
          Text(value, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: color)),
        ],
      ),
    );
  }
}