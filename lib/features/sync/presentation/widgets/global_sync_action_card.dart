import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/sync/application/global_sync_state_provider.dart';

class GlobalSyncActionCard extends ConsumerWidget {
  final GlobalSyncStateModel state;
  final VoidCallback onRefreshAll;

  const GlobalSyncActionCard({
    super.key,
    required this.state,
    required this.onRefreshAll,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final subtitle = state.isRunning
        ? '${i18n.t('Refreshing')} ${state.processedItems}/${state.totalItems}'
        : state.finishedAt != null
            ? 'Last sync finished'
            : 'No global sync yet';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              state.isRunning ? i18n.t('Global sync in progress') : i18n.t('Global sync'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(i18n.t(subtitle)),
            if (state.isRunning) ...[
              const SizedBox(height: 12),
              LinearProgressIndicator(value: state.progressRatio),
            ],
            const SizedBox(height: 12),
            FilledButton(
              onPressed: state.isRunning ? null : onRefreshAll,
              child: Text(i18n.t('Refresh all')),
            ),
          ],
        ),
      ),
    );
  }
}