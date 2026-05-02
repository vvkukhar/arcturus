import 'package:flutter/material.dart';

class InventoryEmptyView extends StatelessWidget {
  const InventoryEmptyView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Нічого не знайдено.'),
    );
  }
}