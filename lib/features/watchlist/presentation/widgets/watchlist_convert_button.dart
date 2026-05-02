import 'package:flutter/material.dart';

class WatchlistConvertButton extends StatelessWidget {
  final VoidCallback onPressed;

  const WatchlistConvertButton({
    super.key,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton.tonalIcon(
        onPressed: onPressed,
        icon: const Icon(Icons.inventory_2_outlined),
        label: const Text('To Inventory'),
      ),
    );
  }
}