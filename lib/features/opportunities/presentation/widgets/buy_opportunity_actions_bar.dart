import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/ui/loading_button.dart';
import 'package:lego_trading_manager/core/ui/app_toast.dart';
import 'package:lego_trading_manager/features/opportunities/application/opportunity_action_state_provider.dart';

class BuyOpportunityActionsBar extends ConsumerWidget {
  final String id;
  final Future<void> Function() onAdd;

  const BuyOpportunityActionsBar({
    super.key,
    required this.id,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifier = ref.read(opportunityActionProvider.notifier);
    final state = ref.watch(opportunityActionProvider);
    final loading = state.loadingIds.contains(id);

    return Row(
      children: [
        Expanded(child: Container()),
        LoadingButton(
          loading: loading,
          text: 'Add to flow',
          onPressed: () async {
            notifier.start(id);
            try {
              await onAdd();
              if (context.mounted) {
                AppToast.show(context, 'Added to flow');
              }
            } catch (e) {
              if (context.mounted) {
                AppToast.show(context, 'Error: $e');
              }
            } finally {
              notifier.stop(id);
            }
          },
        ),
      ],
    );
  }
}
