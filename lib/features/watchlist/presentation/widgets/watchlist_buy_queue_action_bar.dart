import 'package:flutter/material.dart';

class WatchlistBuyQueueActionBar extends StatelessWidget {
  final VoidCallback onAddToPurchaseFlow;

  const WatchlistBuyQueueActionBar({
    super.key,
    required this.onAddToPurchaseFlow,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        FilledButton(
          onPressed: onAddToPurchaseFlow,
          child: const Text('Add to purchase flow'),
        ),
      ],
    );
  }
}