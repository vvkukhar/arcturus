import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_item_card.dart';

class InventorySelectableItemCard extends ConsumerWidget {
  final ItemModel item;
  final bool selected;
  final VoidCallback onTap;
  final VoidCallback onToggleSelection;

  const InventorySelectableItemCard({
    super.key,
    required this.item,
    required this.selected,
    required this.onTap,
    required this.onToggleSelection,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Stack(
      children: [
        InventoryItemCard(
          item: item,
          onTap: onTap,
        ),
        Positioned(
          top: 10,
          right: 10,
          child: InkWell(
            onTap: onToggleSelection,
            borderRadius: BorderRadius.circular(999),
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: selected
                    ? Colors.green.withValues(alpha: 0.18)
                    : Colors.white10,
                shape: BoxShape.circle,
                border: Border.all(
                  color: selected ? Colors.green : Colors.white30,
                ),
              ),
              child: Icon(
                selected ? Icons.check : Icons.add,
                size: 18,
                color: selected ? Colors.green : Colors.white70,
              ),
            ),
          ),
        ),
      ],
    );
  }
}