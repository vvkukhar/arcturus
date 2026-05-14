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
          backgroundColor: Colors.transparent, // Важливо для стилізованих bottom sheets
          builder: (_) => const QuickAddSheet(),
        );
      },
      backgroundColor: Colors.greenAccent,
      child: const Icon(Icons.add, color: Colors.black, size: 28),
    );
  }
}