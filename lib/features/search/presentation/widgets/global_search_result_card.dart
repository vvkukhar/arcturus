import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_autosave_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_results_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_confidence_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_confidence_badge.dart';

class GlobalSearchResultCard extends ConsumerWidget {
  final GlobalSearchResultModel result;
  final VoidCallback onTap;

  const GlobalSearchResultCard({
    super.key,
    required this.result,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final controller = ref.read(globalSearchPinnedResultsProvider.notifier);
    final resultId = result.id ?? '';
    final isPinned = controller.isPinned(resultId, result.type);
    final confidence = ref.watch(globalSearchResultConfidenceProvider(result));

    return Card(
      child: ListTile(
        title: Text(result.title),
        subtitle: Text(result.subtitle),
        leading: GlobalSearchConfidenceBadge(label: confidence),
        trailing: IconButton(
          icon: Icon(
            isPinned ? Icons.push_pin : Icons.push_pin_outlined,
          ),
          onPressed: () {
            if (isPinned) {
              controller.unpin(resultId, result.type);
            } else {
              controller.pin(
                GlobalSearchPinnedResultModel(
                  title: result.title,
                  subtitle: result.subtitle,
                  type: result.type,
                  id: resultId,
                ),
              );
            }

            ref.read(globalSearchAutosaveProvider).call();
          },
        ),
        onTap: onTap,
      ),
    );
  }
}