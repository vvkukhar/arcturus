import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_link_status_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_linked_purchase_provider.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';

final saleLinkStatusProvider =
    Provider.family<SaleLinkStatusModel, SaleModel>((ref, sale) {
  final linkedPurchase = ref.watch(saleLinkedPurchaseProvider(sale));
  final links = ref.watch(salePurchaseLinkControllerProvider);

  final isManual = links.any((link) => link.saleId == sale.id);

  if (linkedPurchase == null) {
    return const SaleLinkStatusModel(
      hasLink: false,
      isManual: false,
      label: 'unlinked',
    );
  }

  return SaleLinkStatusModel(
    hasLink: true,
    isManual: isManual,
    label: isManual ? 'manual link' : 'auto item match',
  );
});