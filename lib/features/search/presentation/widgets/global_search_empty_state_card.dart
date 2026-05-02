import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/application/global_search_empty_suggestion_model.dart';

class GlobalSearchEmptyStateCard extends StatelessWidget {
  final List<GlobalSearchEmptySuggestionModel> suggestions;
  final ValueChanged<String> onTry;

  const GlobalSearchEmptyStateCard({
    super.key,
    required this.suggestions,
    required this.onTry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'No results found',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: suggestions.map((item) {
                  return ActionChip(
                    label: Text(item.title),
                    onPressed: () => onTry(item.query),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
