import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class CommandCenterAction {
  final String id;
  final String title;
  final String subtitle;
  final String route;
  final int? badgeCount;
  
  const CommandCenterAction(this.id, this.title, this.subtitle, this.route, {this.badgeCount});
}

class CommandCenterSection {
  final String title;
  final List<CommandCenterAction> actions;
  
  const CommandCenterSection(this.title, this.actions);
}

class CommandCenterEngineState {
  final List<CommandCenterSection> visibleSections;
  final String query;
  
  const CommandCenterEngineState({
    required this.visibleSections, 
    required this.query,
  });
}

class CommandCenterEngine extends Notifier<CommandCenterEngineState> {
  @override
  CommandCenterEngineState build() {
    ref.watch(i18nProvider);
    return _computeState('');
  }

  CommandCenterEngineState _computeState(String query) {
    final i18n = ref.read(i18nProvider.notifier);
    
    final allSections = [
      CommandCenterSection(i18n.t('cc.core'), [
        CommandCenterAction('pos', i18n.t('cc.pos'), i18n.t('cc.pos.sub'), AppRouter.pos),
        CommandCenterAction('inventory', i18n.t('cc.inv'), i18n.t('cc.inv.sub'), AppRouter.inventory),
        CommandCenterAction('watchlist', i18n.t('cc.watch'), i18n.t('cc.watch.sub'), AppRouter.watchlist),
        CommandCenterAction('market', i18n.t('cc.market'), i18n.t('cc.market.sub'), AppRouter.market),
      ]),
      CommandCenterSection(i18n.t('cc.trading'), [
        CommandCenterAction('orders', i18n.t('cc.orders'), i18n.t('cc.orders.sub'), AppRouter.orders),
        CommandCenterAction('flows', i18n.t('cc.flows'), i18n.t('cc.flows.sub'), AppRouter.flows),
        CommandCenterAction('purchases', i18n.t('cc.purchases'), i18n.t('cc.purchases.sub'), AppRouter.purchases),
        CommandCenterAction('sales', i18n.t('cc.sales'), i18n.t('cc.sales.sub'), AppRouter.sales),
        CommandCenterAction('deal_eval', i18n.t('cc.dealEval'), i18n.t('cc.dealEval.sub'), AppRouter.dealEvaluator),
      ]),
      CommandCenterSection(i18n.t('cc.system'), [
        CommandCenterAction('scouts', i18n.t('cc.scouts'), i18n.t('cc.scouts.sub'), AppRouter.scouts),
        CommandCenterAction('monetization', i18n.t('cc.monetization'), i18n.t('cc.monetization.sub'), AppRouter.monetization),
        CommandCenterAction('analytics', i18n.t('cc.analytics'), i18n.t('cc.analytics.sub'), AppRouter.analytics),
        CommandCenterAction('activity', i18n.t('cc.activity'), i18n.t('cc.activity.sub'), AppRouter.activityLog),
        CommandCenterAction('settings', i18n.t('cc.settings'), i18n.t('cc.settings.sub'), AppRouter.settings),
      ]),
    ];

    final q = query.trim().toLowerCase();
    if (q.isEmpty) {
      return CommandCenterEngineState(visibleSections: allSections, query: query);
    }

    final filtered = <CommandCenterSection>[];
    for (final sec in allSections) {
      final acts = sec.actions.where((a) => 
        a.title.toLowerCase().contains(q) || a.subtitle.toLowerCase().contains(q)
      ).toList();
      
      if (acts.isNotEmpty) {
        filtered.add(CommandCenterSection(sec.title, acts));
      }
    }

    return CommandCenterEngineState(visibleSections: filtered, query: query);
  }

  void search(String query) {
    state = _computeState(query);
  }
}

final commandCenterEngineProvider = NotifierProvider<CommandCenterEngine, CommandCenterEngineState>(CommandCenterEngine.new);