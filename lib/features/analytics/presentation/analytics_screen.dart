import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';
import 'package:lego_trading_manager/core/widgets/global_quick_add_fab.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_apply_selected_reprice_service.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_execution_service.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_health_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_confidence_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_maturity_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_pressure_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_stability_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_best_preset_hint_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_breakdown_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_bulk_reprice_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_efficiency_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_monthly_profit_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_bands_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_apply_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_diff_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_preview_mode_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_selection_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_restore_preset_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_entry_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_leaderboard_polish_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_presets_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_usage_leaderboard_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_mode_insight_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_pressure_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_split_stats_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_entry_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_preview_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_durability_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_equilibrium_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_health_index_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_mix_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_pressure_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_readiness_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_resilience_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_theme_profit_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/capital_allocation_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_band_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/turnover_buckets_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/velocity_tracking_provider.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_auto_rule_health_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_auto_rules_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_auto_rules_execute_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_automation_confidence_banner.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_automation_maturity_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_automation_pressure_summary_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_automation_stability_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_best_preset_hint_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_breakdown_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_bulk_reprice_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_empty_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_execution_efficiency_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_execution_totals_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_monthly_profit_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_profit_band_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_profit_summary_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_confirmation_dialog.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_diff_totals_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_preview_mode_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_preview_table.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_execution_history_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_leaderboard_polish_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_presets_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_schedule_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_stack_summary_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_rule_usage_leaderboard_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_run_mode_insight_banner.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_run_pressure_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_run_split_stats_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_scheduled_run_log_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_section_title.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_selected_reprice_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_selected_reprice_preview_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_selected_reprice_summary_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_selection_controls_bar.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_durability_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_equilibrium_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_health_index_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_mix_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_pressure_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_readiness_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_stack_resilience_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_theme_profit_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/auto_price_suggestion_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/capital_allocation_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/flip_score_band_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/flip_score_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/market_inventory_reprice_suggestion_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/smart_recommendation_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/turnover_bucket_card.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/velocity_bucket_card.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  static const int previewLimit = 10;
  static const int compactLimit = 6;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(analyticsRestorePresetProvider).call();
    });
  }

  Future<bool> _confirm(
    BuildContext context, {
    required String title,
    required String subtitle,
  }) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (_) => AnalyticsRepriceConfirmationDialog(
        title: title,
        subtitle: subtitle,
      ),
    );
    return result == true;
  }

  Future<void> _executeAutoRules(ScaffoldMessengerState messenger) async {
    final i18n = ref.read(i18nProvider.notifier);
    final result = await ref.read(analyticsAutoRuleExecutionProvider).run();

    ref.read(analyticsRuleExecutionHistoryProvider.notifier).add(
          AnalyticsRuleExecutionHistoryEntryModel(
            createdAt: DateTime.now(),
            repricedItems: result.repricedItems,
            highlightedOldStock: result.highlightedOldStock,
            profitPriorityEnabled: result.profitPriorityEnabled,
          ),
        );

    final schedule = ref.read(analyticsRuleScheduleProvider);
    if (schedule.enabled) {
      ref.read(analyticsScheduledRunLogProvider.notifier).add(
            AnalyticsScheduledRunLogEntryModel(
              createdAt: DateTime.now(),
              frequency: schedule.frequencyLabel,
              affectedItems: result.repricedItems,
            ),
          );
    }

    if (!mounted) return;

    messenger.showSnackBar(
      SnackBar(
        content: Text(
          '${i18n.t('Auto-rules done')}: repriced ${result.repricedItems}, old stock ${result.highlightedOldStock}',
        ),
      ),
    );
  }

  Future<void> _applySelectedRepricing(
    ScaffoldMessengerState messenger,
  ) async {
    final i18n = ref.read(i18nProvider.notifier);
    final selectedSummary = ref.read(analyticsSelectedRepriceSummaryProvider);

    final approved = await _confirm(
      context,
      title: i18n.t('Apply selected repricing?'),
      subtitle: '${i18n.t('Apply repricing for')} ${selectedSummary.count} ${i18n.t('selected items with total delta')} ${selectedSummary.delta.toStringAsFixed(2)}?',
    );
    if (!approved) return;

    final affected = await ref.read(analyticsApplySelectedRepriceProvider).run();

    if (!mounted) return;

    messenger.showSnackBar(
      SnackBar(
        content: Text('${i18n.t('Applied repricing to')} $affected ${i18n.t('selected items')}'),
      ),
    );
  }

  Widget _buildProfitSection(String currency) {
    final i18n = ref.watch(i18nProvider.notifier);
    final profitSummary = ref.watch(analyticsProfitSummaryProvider);
    final capitalAllocation = ref.watch(capitalAllocationProvider);
    final monthlyProfit = ref.watch(analyticsMonthlyProfitProvider);
    final platformBreakdown = ref.watch(analyticsPlatformBreakdownProvider);
    final themeBreakdown = ref.watch(analyticsThemeBreakdownProvider);
    final themeProfit = ref.watch(analyticsThemeProfitProvider);
    final profitBands = ref.watch(analyticsProfitBandsProvider);
    final turnoverBuckets = ref.watch(turnoverBucketsProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnalyticsSectionTitle(title: i18n.t('Profit Summary')),
        AnalyticsProfitSummaryCard(model: profitSummary),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Capital Allocation')),
        ...capitalAllocation.map(
          (entry) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: CapitalAllocationCard(entry: entry),
          ),
        ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Monthly Profit')),
        if (monthlyProfit.isEmpty)
          AnalyticsEmptyCard(message: i18n.t('No monthly sales data yet.'))
        else
          ...monthlyProfit.take(compactLimit).map(
                (entry) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: AnalyticsMonthlyProfitCard(
                    model: entry,
                    currency: currency,
                  ),
                ),
              ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Breakdowns')),
        AnalyticsBreakdownCard(
          title: i18n.t('Platform Net Breakdown'),
          items: platformBreakdown,
          currency: currency,
        ),
        const SizedBox(height: 12),
        AnalyticsBreakdownCard(
          title: i18n.t('Theme Cost Breakdown'),
          items: themeBreakdown,
          currency: currency,
        ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Theme Profit')),
        if (themeProfit.isEmpty)
          AnalyticsEmptyCard(message: i18n.t('No theme profit data yet.'))
        else
          ...themeProfit.take(compactLimit).map(
                (entry) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: AnalyticsThemeProfitCard(
                    entry: entry,
                    currency: currency,
                  ),
                ),
              ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Profit Bands')),
        if (profitBands.isEmpty)
          AnalyticsEmptyCard(message: i18n.t('No sold-item profit bands yet.'))
        else
          ...profitBands.map(
            (band) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: AnalyticsProfitBandCard(band: band),
            ),
          ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Turnover Buckets')),
        if (turnoverBuckets.isEmpty)
          AnalyticsEmptyCard(message: i18n.t('No turnover data yet.'))
        else
          ...turnoverBuckets.map(
            (bucket) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: TurnoverBucketCard(bucket: bucket),
            ),
          ),
      ],
    );
  }

  Widget _buildAutomationSection(ScaffoldMessengerState messenger) {
    final i18n = ref.watch(i18nProvider.notifier);
    final autoRules = ref.watch(analyticsAutoRulesProvider);
    final bestPresetHint = ref.watch(analyticsBestPresetHintProvider);
    final autoRuleHealth = ref.watch(analyticsAutoRuleHealthProvider);
    final automationMaturity = ref.watch(analyticsAutomationMaturityProvider);
    final automationPressure = ref.watch(analyticsAutomationPressureSummaryProvider);
    final automationStability = ref.watch(analyticsAutomationStabilityProvider);
    final automationConfidence = ref.watch(analyticsAutomationConfidenceProvider);
    final ruleStackSummary = ref.watch(analyticsRuleStackSummaryProvider);
    final stackReadiness = ref.watch(analyticsStackReadinessProvider);
    final stackPressure = ref.watch(analyticsStackPressureProvider);
    final stackMix = ref.watch(analyticsStackMixProvider);
    final stackResilience = ref.watch(analyticsStackResilienceProvider);
    final stackEquilibrium = ref.watch(analyticsStackEquilibriumProvider);
    final stackDurability = ref.watch(analyticsStackDurabilityProvider);
    final stackHealthIndex = ref.watch(analyticsStackHealthIndexProvider);
    final polishedRuleLeaderboard = ref.watch(analyticsRuleLeaderboardPolishProvider);
    final usageLeaderboard = ref.watch(analyticsRuleUsageLeaderboardProvider);
    final ruleSchedule = ref.watch(analyticsRuleScheduleProvider);
    final ruleHistory = ref.watch(analyticsRuleExecutionHistoryProvider);
    final scheduledRunLog = ref.watch(analyticsScheduledRunLogProvider);
    final runSplitStats = ref.watch(analyticsRunSplitStatsProvider);
    final runModeInsight = ref.watch(analyticsRunModeInsightProvider);
    final executionTotals = ref.watch(analyticsExecutionTotalsProvider);
    final executionEfficiency = ref.watch(analyticsExecutionEfficiencyProvider);
    final runPressure = ref.watch(analyticsRunPressureProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnalyticsSectionTitle(title: i18n.t('Automation')),
        AnalyticsRulePresetsBar(
          onApply: (preset) {
            ref.read(analyticsRulePresetsProvider).applyPreset(preset);
            messenger.showSnackBar(
              SnackBar(content: Text('${i18n.t('Preset applied')}: ${preset.title}')),
            );
          },
        ),
        const SizedBox(height: 12),
        AnalyticsRuleScheduleCard(
          model: ruleSchedule,
          onToggle: (value) {
            ref.read(analyticsRuleScheduleProvider.notifier).toggle(value);
          },
          onFrequencyChanged: (value) {
            if (value == null) return;
            ref.read(analyticsRuleScheduleProvider.notifier).setFrequency(value);
          },
        ),
        const SizedBox(height: 12),
        AnalyticsBestPresetHintCard(model: bestPresetHint),
        const SizedBox(height: 12),
        AnalyticsAutoRulesCard(
          items: autoRules,
          onToggle: (id) {
            ref.read(analyticsAutoRulesProvider.notifier).toggle(id);
          },
        ),
        const SizedBox(height: 12),
        AnalyticsAutoRulesExecuteBar(
          onExecute: () => _executeAutoRules(messenger),
        ),
        const SizedBox(height: 12),
        AnalyticsAutoRuleHealthCard(model: autoRuleHealth),
        const SizedBox(height: 12),
        AnalyticsAutomationMaturityCard(model: automationMaturity),
        const SizedBox(height: 12),
        AnalyticsAutomationPressureSummaryCard(model: automationPressure),
        const SizedBox(height: 12),
        AnalyticsAutomationStabilityCard(model: automationStability),
        const SizedBox(height: 12),
        AnalyticsAutomationConfidenceBanner(model: automationConfidence),
        const SizedBox(height: 12),
        AnalyticsRuleStackSummaryCard(model: ruleStackSummary),
        const SizedBox(height: 12),
        AnalyticsStackReadinessCard(model: stackReadiness),
        const SizedBox(height: 12),
        AnalyticsStackPressureCard(model: stackPressure),
        const SizedBox(height: 12),
        AnalyticsStackMixCard(model: stackMix),
        const SizedBox(height: 12),
        AnalyticsStackResilienceCard(model: stackResilience),
        const SizedBox(height: 12),
        AnalyticsStackEquilibriumCard(model: stackEquilibrium),
        const SizedBox(height: 12),
        AnalyticsStackDurabilityCard(model: stackDurability),
        const SizedBox(height: 12),
        AnalyticsStackHealthIndexCard(model: stackHealthIndex),
        const SizedBox(height: 12),
        AnalyticsRuleLeaderboardPolishCard(items: polishedRuleLeaderboard),
        const SizedBox(height: 12),
        AnalyticsRuleUsageLeaderboardCard(items: usageLeaderboard),
        const SizedBox(height: 20),
        AnalyticsRuleExecutionHistoryCard(
          items: ruleHistory,
          onClear: () {
            ref.read(analyticsRuleExecutionHistoryProvider.notifier).clear();
          },
        ),
        const SizedBox(height: 20),
        AnalyticsScheduledRunLogCard(
          items: scheduledRunLog,
          onClear: () {
            ref.read(analyticsScheduledRunLogProvider.notifier).clear();
          },
        ),
        const SizedBox(height: 20),
        AnalyticsRunSplitStatsCard(model: runSplitStats),
        const SizedBox(height: 20),
        AnalyticsRunModeInsightBanner(model: runModeInsight),
        const SizedBox(height: 20),
        AnalyticsExecutionTotalsCard(model: executionTotals),
        const SizedBox(height: 20),
        AnalyticsExecutionEfficiencyCard(model: executionEfficiency),
        const SizedBox(height: 20),
        AnalyticsRunPressureCard(model: runPressure),
      ],
    );
  }

  Widget _buildRepriceSection(
    String currency,
    ScaffoldMessengerState messenger,
  ) {
    final i18n = ref.watch(i18nProvider.notifier);
    final repriceSuggestions = ref.watch(marketInventoryRepriceSuggestionProvider);
    final repriceDiffTotals = ref.watch(analyticsRepriceDiffTotalsProvider);
    final selectedRepricePreview = ref.watch(analyticsSelectedRepricePreviewProvider);
    final selectedRepriceSummary = ref.watch(analyticsSelectedRepriceSummaryProvider);
    final selectedIds = ref.watch(analyticsRepriceSelectionProvider);
    final previewMode = ref.watch(analyticsRepricePreviewModeProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnalyticsSectionTitle(title: i18n.t('Inventory Reprice Suggestions')),
        AnalyticsBulkRepriceBar(
          onApply98: () async {
            final approved = await _confirm(
              context,
              title: i18n.t('Apply bulk repricing?'),
              subtitle: i18n.t('This will set expected sale price to 98% of market average for all eligible items.'),
            );
            if (!approved) return;

            final affected = await ref.read(analyticsBulkRepriceProvider).applyAllMarket98();

            if (!mounted) return;

            messenger.showSnackBar(
              SnackBar(
                content: Text('${i18n.t('Bulk repricing applied to')} $affected ${i18n.t('items')}'),
              ),
            );
          },
        ),
        const SizedBox(height: 12),
        AnalyticsRepriceDiffTotalsBar(model: repriceDiffTotals),
        const SizedBox(height: 12),
        AnalyticsSelectionControlsBar(
          onSelectAll: () {
            final ids = repriceSuggestions.map((e) => e.itemId).toSet();
            ref.read(analyticsRepriceSelectionProvider.notifier).setAll(ids);
          },
          onClear: () {
            ref.read(analyticsRepriceSelectionProvider.notifier).clear();
          },
        ),
        const SizedBox(height: 8),
        AnalyticsSelectedRepricePreviewCard(model: selectedRepricePreview),
        const SizedBox(height: 12),
        AnalyticsSelectedRepriceSummaryCard(model: selectedRepriceSummary),
        const SizedBox(height: 12),
        AnalyticsSelectedRepriceBar(
          selectedCount: selectedIds.length,
          onApplySelected: () => _applySelectedRepricing(messenger),
          onClear: () {
            ref.read(analyticsRepriceSelectionProvider.notifier).clear();
          },
        ),
        const SizedBox(height: 12),
        AnalyticsRepricePreviewModeBar(
          value: previewMode,
          onChanged: (value) {
            ref.read(analyticsRepricePreviewModeProvider.notifier).set(value);
          },
        ),
        const SizedBox(height: 12),
        if (repriceSuggestions.isEmpty)
          AnalyticsEmptyCard(
            message: i18n.t('No market-based repricing suggestions yet.'),
          )
        else if (previewMode == AnalyticsRepricePreviewMode.table)
          AnalyticsRepricePreviewTable(
            items: repriceSuggestions.take(previewLimit).toList(),
            selectedIds: selectedIds,
            onToggle: (id) {
              ref.read(analyticsRepriceSelectionProvider.notifier).toggle(id);
            },
            onApply: (item) async {
              final approved = await _confirm(
                context,
                title: i18n.t('Apply repricing?'),
                subtitle: '${i18n.t('Update')} "${item.title}" ${i18n.t('from')} ${item.currentExpected.toStringAsFixed(2)} ${i18n.t('to')} ${item.suggestedPrice.toStringAsFixed(2)}?',
              );
              if (!approved) return;

              await ref.read(analyticsRepriceApplyProvider).applySuggestedPrice(
                    itemId: item.itemId,
                    suggestedPrice: item.suggestedPrice,
                    title: item.title,
                  );

              if (!mounted) return;

              messenger.showSnackBar(
                SnackBar(
                  content: Text('${i18n.t('Repricing applied for')} ${item.title}'),
                ),
              );
            },
          )
        else
          ...repriceSuggestions.take(previewLimit).map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: MarketInventoryRepriceSuggestionCard(
                    model: item,
                    selected: selectedIds.contains(item.itemId),
                    onSelect: (_) {
                      ref.read(analyticsRepriceSelectionProvider.notifier).toggle(item.itemId);
                    },
                    onApply: () async {
                      final approved = await _confirm(
                        context,
                        title: i18n.t('Apply repricing?'),
                        subtitle: '${i18n.t('Update')} "${item.title}" ${i18n.t('from')} ${item.currentExpected.toStringAsFixed(2)} ${i18n.t('to')} ${item.suggestedPrice.toStringAsFixed(2)}?',
                      );
                      if (!approved) return;

                      await ref.read(analyticsRepriceApplyProvider).applySuggestedPrice(
                            itemId: item.itemId,
                            suggestedPrice: item.suggestedPrice,
                            title: item.title,
                          );

                      if (!mounted) return;

                      messenger.showSnackBar(
                        SnackBar(
                          content: Text('${i18n.t('Repricing applied for')} ${item.title}'),
                        ),
                      );
                    },
                  ),
                ),
              ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Auto Price Suggestions')),
        Builder(
          builder: (_) {
            final priceSuggestions = ref.watch(autoPriceSuggestionsProvider);

            if (priceSuggestions.isEmpty) {
              return AnalyticsEmptyCard(
                message: i18n.t('No pricing suggestions yet.'),
              );
            }

            return Column(
              children: priceSuggestions.take(previewLimit).map((item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: AutoPriceSuggestionCard(
                    model: item,
                    currency: currency,
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  Widget _buildSmartSection(String currency) {
    final i18n = ref.watch(i18nProvider.notifier);
    final recommendations = ref.watch(smartRecommendationsProvider);
    final flipScoreBands = ref.watch(flipScoreBandsProvider);
    final flipScores = ref.watch(flipScoresProvider);
    final velocityBuckets = ref.watch(velocityTrackingProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnalyticsSectionTitle(title: i18n.t('Smart Recommendations')),
        ...recommendations.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: SmartRecommendationCard(model: item),
          ),
        ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Flip Score Bands')),
        ...flipScoreBands.map(
          (band) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: FlipScoreBandCard(band: band),
          ),
        ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Top Flip Scores')),
        if (flipScores.isEmpty)
          AnalyticsEmptyCard(message: i18n.t('No flip score data yet.'))
        else
          ...flipScores.take(previewLimit).map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: FlipScoreCard(model: item),
                ),
              ),
        const SizedBox(height: 20),
        AnalyticsSectionTitle(title: i18n.t('Velocity Buckets')),
        ...velocityBuckets.map(
          (bucket) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: VelocityBucketCard(bucket: bucket),
          ),
        ),
        const SizedBox(height: 20),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              '${i18n.t('Top flip score now')}: '
              '${flipScores.isEmpty ? '-' : flipScores.first.title} '
              '${flipScores.isEmpty ? '' : '(${flipScores.first.score.toStringAsFixed(1)})'}',
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Builder(
          builder: (_) {
            final priceSuggestions = ref.watch(autoPriceSuggestionsProvider);

            return Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  '${i18n.t('Best suggested price delta')}: '
                  '${priceSuggestions.isEmpty ? '-' : CurrencyFormatter.format(priceSuggestions.first.suggestedPrice - priceSuggestions.first.currentExpected, currency: currency)}',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);
    final currency = ref.watch(appSettingsControllerProvider).baseCurrency;
    final messenger = ScaffoldMessenger.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('analytics.title')),
      ),
      drawer: const AppDrawer(),
      floatingActionButton: const GlobalQuickAddFab(),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildProfitSection(currency),
          const SizedBox(height: 24),
          _buildAutomationSection(messenger),
          const SizedBox(height: 24),
          _buildRepriceSection(currency, messenger),
          const SizedBox(height: 24),
          _buildSmartSection(currency),
        ],
      ),
    );
  }
}