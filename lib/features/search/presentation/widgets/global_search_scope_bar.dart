import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/presentation/widgets/global_search_scope_chips.dart';

class GlobalSearchScopeBar extends StatelessWidget {
  final String? selected;
  final ValueChanged<String?> onSelected;
  final VoidCallback onSaveAsDefault;

  const GlobalSearchScopeBar({
    super.key,
    required this.selected,
    required this.onSelected,
    required this.onSaveAsDefault,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GlobalSearchScopeChips(
              selected: selected,
              onSelected: onSelected,
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: onSaveAsDefault,
                child: const Text('Save as default scope'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}