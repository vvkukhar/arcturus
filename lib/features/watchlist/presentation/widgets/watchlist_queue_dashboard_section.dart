import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_allocation_stability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_durability_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_commit_stability_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_balance_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_discipline_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_maturity_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_action_confidence_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_affordability_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_batch_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_cash_warning_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_commit_hint_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_hint_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_pressure_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_next_best_action_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_profitability_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_readiness_score_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_risk_reward_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_smart_rank_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_allocation_stability_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_auto_buy_cash_compare_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_auto_buy_simulation_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_available_cash_input_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_capital_discipline_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_commit_durability_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_commit_stability_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_balance_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_discipline_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_execution_maturity_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_action_confidence_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_actionable_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_affordability_badge.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_affordability_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_batch_summary_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_buy_power_ratio_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_cash_warning_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_commit_hint_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_execution_hint_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_execution_pressure_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_next_best_action_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_pressure_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_profitability_summary_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_readiness_score_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_risk_reward_banner.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_queue_summary_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_smart_rank_card.dart';

class WatchlistQueueDashboardSection extends StatelessWidget {
  final double availableCash;
  final ValueChanged<double> onAvailableCashChanged;
  final WatchlistAutoBuySimulationModel autoBuySimulation;
  final WatchlistAutoBuyCashCompareModel autoBuyCashCompare;
  final WatchlistQueueCashWarningModel queueCashWarning;
  final WatchlistQueueSummaryModel queueSummary;
  final WatchlistQueueProfitabilitySummaryModel queueProfitability;
  final String affordabilityBadge;
  final WatchlistQueueAffordabilitySummaryModel affordabilitySummary;
  final WatchlistQueueBuyPowerRatioModel queueBuyPowerRatio;
  final WatchlistQueuePressureModel queuePressure;
  final List<WatchlistSmartRankModel> smartRank;
  final WatchlistQueueBatchSummaryModel queueBatchSummary;
  final WatchlistQueueActionableSummaryModel actionableQueueSummary;
  final WatchlistQueueExecutionHintModel queueExecutionHint;
  final WatchlistQueueExecutionPressureSummaryModel queueExecutionPressureSummary;
  final WatchlistQueueNextBestActionModel nextBestAction;
  final WatchlistQueueReadinessScoreModel queueReadiness;
  final WatchlistQueueActionConfidenceModel queueActionConfidence;
  final WatchlistQueueCommitHintModel queueCommitHint;
  final WatchlistCommitStabilityModel commitStability;
  final WatchlistExecutionMaturityModel executionMaturity;
  final WatchlistQueueRiskRewardModel queueRiskReward;
  final WatchlistCapitalDisciplineModel capitalDiscipline;
  final WatchlistExecutionDisciplineModel executionDiscipline;
  final WatchlistExecutionBalanceModel executionBalance;
  final WatchlistCommitDurabilityModel commitDurability;
  final WatchlistAllocationStabilityModel allocationStability;

  const WatchlistQueueDashboardSection({
    super.key,
    required this.availableCash,
    required this.onAvailableCashChanged,
    required this.autoBuySimulation,
    required this.autoBuyCashCompare,
    required this.queueCashWarning,
    required this.queueSummary,
    required this.queueProfitability,
    required this.affordabilityBadge,
    required this.affordabilitySummary,
    required this.queueBuyPowerRatio,
    required this.queuePressure,
    required this.smartRank,
    required this.queueBatchSummary,
    required this.actionableQueueSummary,
    required this.queueExecutionHint,
    required this.queueExecutionPressureSummary,
    required this.nextBestAction,
    required this.queueReadiness,
    required this.queueActionConfidence,
    required this.queueCommitHint,
    required this.commitStability,
    required this.executionMaturity,
    required this.queueRiskReward,
    required this.capitalDiscipline,
    required this.executionDiscipline,
    required this.executionBalance,
    required this.commitDurability,
    required this.allocationStability,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        WatchlistAvailableCashInputCard(
          value: availableCash,
          onChanged: onAvailableCashChanged,
        ),
        const SizedBox(height: 14),
        WatchlistAutoBuySimulationCard(model: autoBuySimulation),
        const SizedBox(height: 14),
        WatchlistAutoBuyCashCompareCard(model: autoBuyCashCompare),
        const SizedBox(height: 14),
        WatchlistQueueCashWarningCard(model: queueCashWarning),
        const SizedBox(height: 14),
        WatchlistQueueSummaryBar(model: queueSummary),
        const SizedBox(height: 12),
        WatchlistQueueProfitabilitySummaryCard(model: queueProfitability),
        const SizedBox(height: 12),
        Row(
          children: [
            const Text(
              'Queue affordability',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(width: 8),
            WatchlistQueueAffordabilityBadge(label: affordabilityBadge),
          ],
        ),
        const SizedBox(height: 12),
        WatchlistQueueAffordabilitySummaryCard(model: affordabilitySummary),
        const SizedBox(height: 12),
        WatchlistQueueBuyPowerRatioCard(model: queueBuyPowerRatio),
        const SizedBox(height: 12),
        WatchlistQueuePressureCard(model: queuePressure),
        const SizedBox(height: 12),
        WatchlistSmartRankCard(items: smartRank),
        const SizedBox(height: 14),
        WatchlistQueueBatchSummaryBanner(model: queueBatchSummary),
        const SizedBox(height: 12),
        WatchlistQueueActionableSummaryCard(model: actionableQueueSummary),
        const SizedBox(height: 12),
        WatchlistQueueExecutionHintCard(model: queueExecutionHint),
        const SizedBox(height: 12),
        WatchlistQueueExecutionPressureSummaryCard(
          model: queueExecutionPressureSummary,
        ),
        const SizedBox(height: 12),
        WatchlistQueueNextBestActionBanner(model: nextBestAction),
        const SizedBox(height: 12),
        WatchlistQueueReadinessScoreCard(model: queueReadiness),
        const SizedBox(height: 12),
        WatchlistQueueActionConfidenceCard(model: queueActionConfidence),
        const SizedBox(height: 12),
        WatchlistQueueCommitHintBanner(model: queueCommitHint),
        const SizedBox(height: 12),
        WatchlistCommitStabilityBanner(model: commitStability),
        const SizedBox(height: 12),
        WatchlistExecutionMaturityCard(model: executionMaturity),
        const SizedBox(height: 12),
        WatchlistQueueRiskRewardBanner(model: queueRiskReward),
        const SizedBox(height: 12),
        WatchlistCapitalDisciplineBanner(model: capitalDiscipline),
        const SizedBox(height: 12),
        WatchlistExecutionDisciplineBanner(model: executionDiscipline),
        const SizedBox(height: 12),
        WatchlistExecutionBalanceCard(model: executionBalance),
        const SizedBox(height: 12),
        WatchlistCommitDurabilityCard(model: commitDurability),
        const SizedBox(height: 12),
        WatchlistAllocationStabilityCard(model: allocationStability),
      ],
    );
  }
}