import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_stock_flow_status_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_link_status_model.dart';
import 'package:lego_trading_manager/features/sales/presentation/widgets/sale_card_v2.dart';

class SaleSelectableCard extends StatelessWidget {
  final SaleModel sale;
  final String statusLabel;
  final SaleLinkStatusModel linkStatus;
  final SaleStockFlowStatusModel stockStatus;
  final bool selected;
  final ValueChanged<bool?> onSelected;
  final VoidCallback onOpenDetails;
  final VoidCallback onDuplicate;
  final VoidCallback onSaveReport;

  const SaleSelectableCard({
    super.key,
    required this.sale,
    required this.statusLabel,
    required this.linkStatus,
    required this.stockStatus,
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
          child: SaleCardV2(
            sale: sale,
            statusLabel: statusLabel,
            linkStatus: linkStatus,
            stockStatus: stockStatus,
            onOpenDetails: onOpenDetails,
            onDuplicate: onDuplicate,
            onSaveReport: onSaveReport,
          ),
        ),
      ],
    );
  }
}