import 'package:flutter/material.dart';

class DetailsActionBar extends StatelessWidget {
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onDuplicate;

  const DetailsActionBar({
    super.key,
    this.onEdit,
    this.onDelete,
    this.onDuplicate,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (onEdit != null)
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: onEdit,
          ),
        if (onDuplicate != null)
          IconButton(
            icon: const Icon(Icons.copy_outlined),
            onPressed: onDuplicate,
          ),
        if (onDelete != null)
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: onDelete,
          ),
      ],
    );
  }
}