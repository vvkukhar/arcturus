import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_exact_match_badge.dart';

class GlobalSearchTopResultBanner extends StatelessWidget {
  final GlobalSearchResultModel? model;
  final bool exactMatch;
  final VoidCallback? onOpen;

  const GlobalSearchTopResultBanner({
    super.key,
    required this.model,
    required this.exactMatch,
    this.onOpen,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Top result: ${model!.title} • score ${model!.priorityScore}',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          GlobalSearchExactMatchBadge(exact: exactMatch),
          if (onOpen != null) ...[
            const SizedBox(width: 8),
            TextButton(
              onPressed: onOpen,
              child: const Text('Open'),
            ),
          ],
        ],
      ),
    );
  }
}