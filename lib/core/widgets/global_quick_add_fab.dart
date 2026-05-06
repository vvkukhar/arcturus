import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/core/presentation/quick_add_sheet.dart';

class GlobalQuickAddFab extends StatelessWidget {
  const GlobalQuickAddFab({super.key});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: () {
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          builder: (_) => const QuickAddSheet(),
        );
      },
      child: const Icon(Icons.add),
    );
  }
}