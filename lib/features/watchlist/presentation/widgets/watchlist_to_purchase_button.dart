import 'package:flutter/material.dart';

class WatchlistToPurchaseButton extends StatelessWidget {
  final VoidCallback onPressed;

  const WatchlistToPurchaseButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.tonalIcon(
      onPressed: onPressed,
      icon: const Icon(Icons.shopping_cart_checkout_outlined),
      label: const Text('To Purchase Draft'),
    );
  }
}