import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:fl_chart/fl_chart.dart'; // ДОДАНО ГРАФІКИ

class AnalyticsScreen extends ConsumerWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stateAsync = ref.watch(analyticsEngineProvider);
    final engine = ref.read(analyticsEngineProvider.notifier);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: Text(i18n.t('cc.analytics'), style: const TextStyle(fontWeight: FontWeight.w900))),
      body: stateAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text(i18n.t('common.error', {'error': e.toString()}))),
        data: (state) => CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFinancialSummary(state, i18n),
                    const SizedBox(height: 24),
                    _buildRecommendations(state.recommendations, i18n),
                    const SizedBox(height: 24),
                    _buildRepriceSection(state.repriceSuggestions, engine, i18n),
                    const SizedBox(height: 24),
                    _buildDistributions(state, i18n), // ТУТ ТЕПЕР ГРАФІКИ
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildFinancialSummary(AnalyticsEngineState state, I18nNotifier i18n) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          _StatRow(label: i18n.t('analytics.netProfit'), value: '${state.totalNetProfit.toStringAsFixed(2)} ${state.currency}', isPositive: state.totalNetProfit >= 0),
          const Divider(height: 24, color: Colors.white10),
          _StatRow(label: i18n.t('analytics.revenue'), value: '${state.totalSoldRevenue.toStringAsFixed(2)} ${state.currency}'),
          _StatRow(label: i18n.t('analytics.invested'), value: '${state.totalInvested.toStringAsFixed(2)} ${state.currency}'),
          _StatRow(label: i18n.t('analytics.invValue'), value: '${state.inventoryValue.toStringAsFixed(2)} ${state.currency}'),
          _StatRow(label: i18n.t('analytics.frozen'), value: '${state.frozenCapital.toStringAsFixed(2)} ${state.currency}'),
          const Divider(height: 24, color: Colors.white10),
          _StatRow(label: i18n.t('analytics.avgRoi'), value: '${state.averageRoi.toStringAsFixed(1)}%', isPositive: state.averageRoi >= 0),
          _StatRow(label: i18n.t('analytics.avgMargin'), value: '${state.averageMargin.toStringAsFixed(1)}%'),
        ],
      ),
    );
  }

  Widget _buildRecommendations(List<SmartRecommendation> recs, I18nNotifier i18n) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(i18n.t('analytics.smartRecs'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
              subtitle: Text(r.message, maxLines: 2, overflow: TextOverflow.ellipsis),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildRepriceSection(List<RepriceSuggestion> suggestions, AnalyticsEngine engine, I18nNotifier i18n) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(i18n.t('analytics.repriceOpps'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            if (suggestions.isNotEmpty)
              TextButton.icon(
                onPressed: () => engine.applyMarketRepriceToAll(),
                icon: const Icon(Icons.auto_fix_high, size: 16),
                label: Text(i18n.t('analytics.applyAll')),
              )
          ],
        ),
        const SizedBox(height: 12),
        if (suggestions.isEmpty)
          Text(i18n.t('analytics.noReprice'), style: const TextStyle(color: Colors.white54)),
        ...suggestions.take(5).map((s) {
          final isPositive = s.suggested >= s.current;
          final color = isPositive ? Colors.green : Colors.orange;
          return Card(
            color: const Color(0xFF171A21),
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              title: Text(s.title, style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
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

  // ДОДАНО ГРАФІКИ
  Widget _buildDistributions(AnalyticsEngineState state, I18nNotifier i18n) {
    return Column(
      children: [
        _buildChartSection('${i18n.t('analytics.capAlloc')} (${state.currency})', state.capitalAllocation, true),
        const SizedBox(height: 24),
        _buildChartSection(i18n.t('analytics.velocity'), state.velocityBuckets.map((k, v) => MapEntry(k, v.toDouble())), false),
        const SizedBox(height: 24),
        _buildChartSection('${i18n.t('analytics.profitBands')} (${state.currency})', state.profitBands.map((k, v) => MapEntry(k, v.toDouble())), false),
      ],
    );
  }

  Widget _buildChartSection(String title, Map<String, double> data, bool isMoney) {
    final colors = [Colors.blueAccent, Colors.greenAccent, Colors.orangeAccent, Colors.purpleAccent, Colors.redAccent, Colors.cyanAccent];
    
    // Відкидаємо пусті значення для графіку
    final validData = data.entries.where((e) => e.value > 0).toList();
    if (validData.isEmpty) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          const Text('No data available yet.', style: TextStyle(color: Colors.white54)),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
          child: Column(
            children: [
              SizedBox(
                height: 200,
                child: PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 40,
                    sections: validData.asMap().entries.map((entry) {
                      final val = entry.value.value;
                      return PieChartSectionData(
                        color: colors[entry.key % colors.length],
                        value: val,
                        title: isMoney ? '${(val / 1000).toStringAsFixed(1)}k' : val.toStringAsFixed(0),
                        radius: 50,
                        titleStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                      );
                    }).toList(),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12, runSpacing: 8,
                children: validData.asMap().entries.map((entry) {
                  return Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(width: 12, height: 12, decoration: BoxDecoration(color: colors[entry.key % colors.length], shape: BoxShape.circle)),
                      const SizedBox(width: 4),
                      Text('${entry.value.key} (${isMoney ? entry.value.value.toStringAsFixed(0) : entry.value.value.toStringAsFixed(0)})', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    ],
                  );
                }).toList(),
              ),
            ],
          ),
        ),
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
          Flexible(child: Text(label, style: const TextStyle(color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis)),
          const SizedBox(width: 8),
          Text(value, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: color)),
        ],
      ),
    );
  }
}