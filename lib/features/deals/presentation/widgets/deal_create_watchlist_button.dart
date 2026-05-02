import 'package:flutter/material.dart';

class DealCreateWatchlistButton extends StatelessWidget {
  final VoidCallback onPressed;

  const DealCreateWatchlistButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.icon(
      onPressed: onPressed,
      icon: const Icon(Icons.playlist_add_outlined),
      label: const Text('Create Watchlist Item'),
    );
  }
}
