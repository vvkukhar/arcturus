import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/action_report_helper_provider.dart';
import 'package:lego_trading_manager/features/settings/application/save_action_report_flow_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/opportunity_center_action_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/opportunity_center_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_quick_buy_provider.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/opportunity_center_card.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_card_v2.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_action_bar.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_card.dart';

class OpportunityCenterScreen extends ConsumerWidget {
  const OpportunityCenterScreen({super.key});

  void _handleAction(BuildContext context, String actionKey) {
    switch (actionKey) {
      case 'open_watchlist':
      case 'target_hits':
      case 'under_max':
        Navigator.of(context).pushNamed(AppRouter.watchlist);
        break;
      default:
        break;
    }
  }

  Future<void> _saveReport(
    BuildContext context,
    WidgetRef ref,
    int count,
    I18nNotifier i18n,
  ) async {
    final result = await ref.read(saveActionReportFlowProvider).openDialog(
          context,
          initialTitle: i18n.t('Opportunity Center Review'),
          initialNote: '${i18n.t('Reviewed')} $count ${i18n.t('live opportunities')}',
        );

    if (result == null) return;

    await ref.read(actionReportHelperProvider).save(
          title: result['title'] ?? i18n.t('Opportunity Center Review'),
          note: result['note'] ?? '',
        );
  }

  Future<void> _quickBuy(
    BuildContext context,
    WidgetRef ref,
    dynamic item,
    I18nNotifier i18n,
  ) async {
    final source = item.sourceItem;
    await ref.read(watchlistQuickBuyProvider).run(source);

    if (!context.mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${i18n.t('Quick buy created')}: ${item.title}')),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final entries = ref.watch(opportunityCenterProvider);
    final opportunities = ref.watch(watchlistOpportunitiesProvider);
    final priorities = ref.watch(watchlistPriorityProvider);
    final actionService = ref.watch(opportunityCenterActionProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text(i18n.t('Opportunity Center')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          WatchlistOpportunityActionBar(
            onOpenWatchlist: () {
              Navigator.of(context).pushNamed(AppRouter.watchlist);
            },
            onSaveReport: () async {
              await _saveReport(context, ref, opportunities.length, i18n);

              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(i18n.t('Opportunity report saved'))),
              );
            },
          ),
          const SizedBox(height: 12),
          WatchlistPriorityActionBar(
            onOpenWatchlist: () {
              Navigator.of(context).pushNamed(AppRouter.watchlist);
            },
            onOpenOpportunities: () {},
          ),
          const SizedBox(height: 12),
          if (priorities.isNotEmpty) ...[
            Text(
              i18n.t('Priority Queue'),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 12),
            ...priorities.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: WatchlistPriorityCard(model: item),
                  ),
                ),
            const SizedBox(height: 20),
          ],
          Text(
            i18n.t('Action Summary'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          ...entries.map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: OpportunityCenterCard(
                entry: entry,
                onTap: () => _handleAction(context, entry.actionKey),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                entries.isEmpty
                    ? '-'
                    : i18n.t(actionService.description(entries.first.actionKey)),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            i18n.t('Live Opportunities'),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          if (opportunities.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(i18n.t('No opportunities right now.')),
              ),
            )
          else
            ...opportunities.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: WatchlistOpportunityCardV2(
                  item: item,
                  onQuickBuy: () => _quickBuy(context, ref, item, i18n),
                  onOpenWatchlist: () {
                    Navigator.of(context).pushNamed(AppRouter.watchlist);
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}