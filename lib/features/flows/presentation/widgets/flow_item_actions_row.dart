import 'package:flutter/material.dart';

class FlowItemActionsRow extends StatelessWidget {
  final VoidCallback onRemove;

  const FlowItemActionsRow({
    super.key,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Container()),
        IconButton(
          onPressed: onRemove,
          icon: const Icon(Icons.delete),
        ),
      ],
    );
  }
}
