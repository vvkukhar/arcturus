import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/presentation/widgets/purchase_card_v2.dart';

class PurchaseSelectableCard extends StatelessWidget {
  final PurchaseModel purchase;
  final String statusLabel;
  final bool selected;
  final ValueChanged<bool?> onSelected;
  final VoidCallback onOpenDetails;
  final VoidCallback onDuplicate;
  final VoidCallback onSaveReport;

  const PurchaseSelectableCard({
    super.key,
    required this.purchase,
    required this.statusLabel,
    required this.selected,
    required this.onSelected,
    required this.onOpenDetails,
    required this.onDuplicate,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: selected,
          onChanged: onSelected,
        ),
        Expanded(
          child: PurchaseCardV2(
            purchase: purchase,
            statusLabel: statusLabel,
            onOpenDetails: onOpenDetails,
            onDuplicate: onDuplicate,
            onSaveReport: onSaveReport,
          ),
        ),
      ],
    );
  }
}