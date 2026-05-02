import 'package:flutter/material.dart';

class WatchlistCreatePurchaseButton extends StatelessWidget {
  final VoidCallback onPressed;

  const WatchlistCreatePurchaseButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.icon(
      onPressed: onPressed,
      icon: const Icon(Icons.shopping_bag_outlined),
      label: const Text('Create Purchase'),
    );
  }
}