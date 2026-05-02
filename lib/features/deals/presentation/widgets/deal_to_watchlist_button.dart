import 'package:flutter/material.dart';

class DealToWatchlistButton extends StatelessWidget {
  final VoidCallback onPressed;

  const DealToWatchlistButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.tonalIcon(
      onPressed: onPressed,
      icon: const Icon(Icons.bookmark_add_outlined),
      label: const Text('To Watchlist Draft'),
    );
  }
}
