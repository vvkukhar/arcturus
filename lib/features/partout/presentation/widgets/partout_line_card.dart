import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class PartOutLineCard extends StatelessWidget {
  final PartOutLineModel line;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  const PartOutLineCard({
    super.key,
    required this.line,
    this.onTap,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      line.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text('${line.itemType.name} • ${line.status.name}'),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 12,
                      runSpacing: 8,
                      children: [
                        Text('Qty: ${line.quantity}'),
                        Text(
                            'Expected: ${line.expectedTotalPrice.toStringAsFixed(2)}'),
                        Text(
                            'Actual: ${line.actualTotalPrice.toStringAsFixed(2)}'),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
