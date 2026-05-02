import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_confidence_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

class GlobalSearchResultCompactTile extends ConsumerWidget {
  final GlobalSearchResultModel result;
  final VoidCallback onTap;

  const GlobalSearchResultCompactTile({
    super.key,
    required this.result,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final confidence = ref.watch(globalSearchResultConfidenceProvider(result));

    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      title: Text(result.title),
      subtitle: Text('${result.subtitle} • $confidence'),
      trailing: Text(
        result.priorityScore.toString(),
        style: const TextStyle(
          color: Colors.white70,
          fontSize: 12,
        ),
      ),
      onTap: onTap,
    );
  }
}