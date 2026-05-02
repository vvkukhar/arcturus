import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_risk_flag_model.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_inline_action_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_quick_status_chips.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_risk_flag_bar.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_status_badge_v2.dart';

class InventorySelectableCard extends StatelessWidget {
  final ItemModel item;
  final bool selected;
  final InventoryRiskFlagModel? riskFlag;
  final VoidCallback onTap;
  final VoidCallback onToggleSelection;
  final ValueChanged<dynamic>? onQuickStatusChanged;
  final VoidCallback? onMarkListed;
  final VoidCallback? onMarkSold;
  final VoidCallback? onArchive;
  final VoidCallback? onReserveToggle;
  final Widget? extraBottom;

  const InventorySelectableCard({
    super.key,
    required this.item,
    required this.selected,
    this.riskFlag,
    required this.onTap,
    required this.onToggleSelection,
    this.onQuickStatusChanged,
    this.onMarkListed,
    this.onMarkSold,
    this.onArchive,
    this.onReserveToggle,
    this.extraBottom,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      InventoryStatusBadgeV2(status: item.status),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text('${item.type.name} • ${item.theme ?? '-'}'),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      Text('Cost: ${item.totalCost.toStringAsFixed(2)}'),
                      Text(
                        'Expected: ${(item.expectedSalePrice ?? 0).toStringAsFixed(2)}',
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  InventoryRiskFlagBar(model: riskFlag),
                  const SizedBox(height: 12),
                  if (onQuickStatusChanged != null)
                    InventoryQuickStatusChips(
                      current: item.status,
                      onChanged: (status) => onQuickStatusChanged!(status),
                    ),
                  const SizedBox(height: 12),
                  if (extraBottom != null) ...[
                    extraBottom!,
                    const SizedBox(height: 12),
                  ],
                  InventoryInlineActionBar(
                    onMarkListed: onMarkListed,
                    onMarkSold: onMarkSold,
                    onArchive: onArchive,
                  ),
                ],
              ),
            ),
          ),
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