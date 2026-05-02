import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_insight_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_best_type_insight_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_cadence_stability_compare_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_compact_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_control_momentum_compare_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_date_range_quick_filter_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_day_insight_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_discipline_stability_mix_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_momentum_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_most_active_day_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operating_cadence_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operational_health_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_rhythm_momentum_compare_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_stability_index_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_insight_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_system_balance_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_query_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_type_filter_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_top_type_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_consistency_ratio_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_control_score_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_stability_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weakest_day_provider.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_balance_insight_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_balance_summary_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_best_type_insight_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_cadence_stability_compare_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_compact_summary_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_consistency_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_control_momentum_compare_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_date_header.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_date_range_quick_chips.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_day_compare_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_day_insight_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_discipline_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_discipline_stability_mix_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_export_summary_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_insight_stack_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_momentum_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_most_active_day_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_operating_cadence_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_operational_health_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_rhythm_momentum_compare_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_stability_index_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_streak_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_streak_insight_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_summary_hero_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_system_balance_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_timeline_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_timeline_search_field.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_timeline_type_dropdown.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_top_type_summary_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_weekly_consistency_ratio_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_weekly_control_score_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_weekly_rhythm_card.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_weekly_stability_banner.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_weakest_day_banner.dart';

class ActivityTimelineScreen extends ConsumerStatefulWidget {
  const ActivityTimelineScreen({super.key});

  @override
  ConsumerState<ActivityTimelineScreen> createState() =>
      _ActivityTimelineScreenState();
}

class _ActivityTimelineScreenState
    extends ConsumerState<ActivityTimelineScreen> {
  final _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller.text = ref.read(activityTimelineQueryProvider);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final latest = ref.watch(latestActivityProvider);
    final query = ref.watch(activityTimelineQueryProvider).trim().toLowerCase();
    final type = ref.watch(activityTimelineTypeFilterProvider);
    final dateRangeFilter = ref.watch(activityDateRangeQuickFilterProvider);
    final compactSummary = ref.watch(activityCompactSummaryProvider);
    final streak = ref.watch(activityStreakProvider);
    final streakInsight = ref.watch(activityStreakInsightProvider);
    final groupedSummary = ref.watch(activityGroupedDaySummaryProvider);
    final dayInsight = ref.watch(activityDayInsightProvider);
    final topTypeSummary = ref.watch(activityTopTypeSummaryProvider);
    final bestTypeInsight = ref.watch(activityBestTypeInsightProvider);
    final mostActiveDay = ref.watch(activityMostActiveDayProvider);
    final weakestDay = ref.watch(activityWeakestDayProvider);
    final balanceSummary = ref.watch(activityBalanceSummaryProvider);
    final balanceInsight = ref.watch(activityBalanceInsightProvider);
    final momentum = ref.watch(activityMomentumProvider);
    final weeklyRhythm = ref.watch(activityWeeklyRhythmProvider);
    final consistency = ref.watch(activityConsistencyProvider);
    final weeklyStability = ref.watch(activityWeeklyStabilityProvider);
    final weeklyConsistencyRatio =
        ref.watch(activityWeeklyConsistencyRatioProvider);
    final rhythmMomentumCompare =
        ref.watch(activityRhythmMomentumCompareProvider);
    final discipline = ref.watch(activityDisciplineProvider);
    final operationalHealth = ref.watch(activityOperationalHealthProvider);
    final weeklyControlScore = ref.watch(activityWeeklyControlScoreProvider);
    final controlMomentumCompare =
        ref.watch(activityControlMomentumCompareProvider);
    final operatingCadence = ref.watch(activityOperatingCadenceProvider);
    final cadenceStability = ref.watch(activityCadenceStabilityCompareProvider);
    final systemBalance = ref.watch(activitySystemBalanceProvider);
    final stabilityIndex = ref.watch(activityStabilityIndexProvider);
    final disciplineStabilityMix =
        ref.watch(activityDisciplineStabilityMixProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Activity Timeline'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ActivityTimelineSearchField(
              controller: _controller,
              onChanged: (value) {
                ref.read(activityTimelineQueryProvider.notifier).state = value;
              },
              onClear: () {
                _controller.clear();
                ref.read(activityTimelineQueryProvider.notifier).state = '';
              },
            ),
            const SizedBox(height: 12),
            ActivityTimelineTypeDropdown(
              value: type,
              onChanged: (value) {
                ref.read(activityTimelineTypeFilterProvider.notifier).state =
                    value;
              },
            ),
            const SizedBox(height: 12),
            ActivityCompactSummaryCard(model: compactSummary),
            const SizedBox(height: 12),
            ActivitySummaryHeroCard(
              title: 'Activity Pulse',
              subtitle:
                  'Best day: ${mostActiveDay?.dateLabel ?? '-'} • Weakest day: ${weakestDay?.dateLabel ?? '-'} • Top type: ${bestTypeInsight?.topType ?? '-'}',
            ),
            const SizedBox(height: 12),
            ActivityMomentumBanner(model: momentum),
            const SizedBox(height: 12),
            ActivityWeeklyRhythmCard(model: weeklyRhythm),
            const SizedBox(height: 12),
            ActivityConsistencyCard(model: consistency),
            const SizedBox(height: 12),
            ActivityWeeklyStabilityBanner(model: weeklyStability),
            const SizedBox(height: 12),
            ActivityWeeklyConsistencyRatioCard(model: weeklyConsistencyRatio),
            const SizedBox(height: 12),
            ActivityRhythmMomentumCompareCard(model: rhythmMomentumCompare),
            const SizedBox(height: 12),
            ActivityDisciplineBanner(model: discipline),
            const SizedBox(height: 12),
            ActivityOperationalHealthBanner(model: operationalHealth),
            const SizedBox(height: 12),
            ActivityWeeklyControlScoreCard(model: weeklyControlScore),
            const SizedBox(height: 12),
            ActivityControlMomentumCompareCard(model: controlMomentumCompare),
            const SizedBox(height: 12),
            ActivityOperatingCadenceCard(model: operatingCadence),
            const SizedBox(height: 12),
            ActivityCadenceStabilityCompareCard(model: cadenceStability),
            const SizedBox(height: 12),
            ActivitySystemBalanceCard(model: systemBalance),
            const SizedBox(height: 12),
            ActivityStabilityIndexCard(model: stabilityIndex),
            const SizedBox(height: 12),
            ActivityDisciplineStabilityMixCard(model: disciplineStabilityMix),
            const SizedBox(height: 12),
            ActivityMostActiveDayBanner(model: mostActiveDay),
            const SizedBox(height: 12),
            ActivityWeakestDayBanner(model: weakestDay),
            const SizedBox(height: 12),
            if (mostActiveDay != null && weakestDay != null) ...[
              ActivityDayCompareCard(
                bestLabel: mostActiveDay.dateLabel,
                bestCount: mostActiveDay.total,
                weakestLabel: weakestDay.dateLabel,
                weakestCount: weakestDay.total,
              ),
              const SizedBox(height: 12),
            ],
            ActivityBalanceSummaryCard(model: balanceSummary),
            const SizedBox(height: 12),
            ActivityBalanceInsightBanner(model: balanceInsight),
            const SizedBox(height: 12),
            ActivityStreakCard(model: streak),
            const SizedBox(height: 12),
            ActivityStreakInsightCard(model: streakInsight),
            const SizedBox(height: 12),
            ActivityInsightStackCard(
              momentum: momentum.label,
              balance: balanceInsight.label,
              streakLabel: '${streakInsight.label} (${streakInsight.value})',
            ),
            const SizedBox(height: 12),
            ActivityDateRangeQuickChips(
              value: dateRangeFilter,
              onChanged: (value) {
                ref.read(activityDateRangeQuickFilterProvider.notifier).state =
                    value;
              },
            ),
            const SizedBox(height: 12),
            Expanded(
              child: latest.when(
                data: (items) {
                  final visible = items.where((item) {
                    final matchesQuery = query.isEmpty ||
                        item.title.toLowerCase().contains(query) ||
                        item.subtitle.toLowerCase().contains(query);
                    final matchesType = type == null || item.type == type;
                    final now = DateTime.now();
                    final dayOnly = DateTime(
                      item.createdAt.year,
                      item.createdAt.month,
                      item.createdAt.day,
                    );
                    final today = DateTime(now.year, now.month, now.day);
                    final diff = today.difference(dayOnly).inDays;
                    final matchesDate = switch (dateRangeFilter) {
                      ActivityDateRangeQuickFilter.all => true,
                      ActivityDateRangeQuickFilter.today => diff == 0,
                      ActivityDateRangeQuickFilter.last3days =>
                        diff >= 0 && diff < 3,
                      ActivityDateRangeQuickFilter.last7days =>
                        diff >= 0 && diff < 7,
                    };
                    return matchesQuery && matchesType && matchesDate;
                  }).toList();

                  if (visible.isEmpty) {
                    return const Center(
                        child: Text('No timeline entries found.'));
                  }

                  DateTime? lastDate;

                  return ListView(
                    children: [
                      ActivityDayInsightCard(model: dayInsight),
                      const SizedBox(height: 12),
                      ActivityTopTypeSummaryCard(items: topTypeSummary),
                      const SizedBox(height: 12),
                      ActivityBestTypeInsightCard(model: bestTypeInsight),
                      const SizedBox(height: 12),
                      ActivityExportSummaryCard(items: groupedSummary),
                      const SizedBox(height: 12),
                      ...visible.map((item) {
                        final currentDate = DateTime(
                          item.createdAt.year,
                          item.createdAt.month,
                          item.createdAt.day,
                        );

                        final widgets = <Widget>[];

                        if (lastDate == null || lastDate != currentDate) {
                          lastDate = currentDate;
                          widgets.add(ActivityDateHeader(date: currentDate));
                        }

                        widgets.add(ActivityTimelineCard(entry: item));

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: widgets,
                        );
                      }),
                    ],
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (_, __) =>
                    const Center(child: Text('Failed to load timeline.')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
