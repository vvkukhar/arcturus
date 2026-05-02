import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sync/application/global_sync_state_provider.dart';

class GlobalSyncActionCard extends StatelessWidget {
  final GlobalSyncStateModel state;
  final VoidCallback onRefreshAll;

  const GlobalSyncActionCard({
    super.key,
    required this.state,
    required this.onRefreshAll,
  });

  @override
  Widget build(BuildContext context) {
    final subtitle = state.isRunning
        ? 'Refreshing ${state.processedItems}/${state.totalItems}'
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
              state.isRunning ? 'Global sync in progress' : 'Global sync',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(subtitle),
            if (state.isRunning) ...[
              const SizedBox(height: 12),
              LinearProgressIndicator(value: state.progressRatio),
            ],
            const SizedBox(height: 12),
            FilledButton(
              onPressed: state.isRunning ? null : onRefreshAll,
              child: const Text('Refresh all'),
            ),
          ],
        ),
      ),
    );
  }
}