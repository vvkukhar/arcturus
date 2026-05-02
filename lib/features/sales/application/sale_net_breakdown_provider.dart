import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_net_breakdown_model.dart';

final saleNetBreakdownProvider =
    Provider.family<SaleNetBreakdownModel, SaleModel>((ref, sale) {
  final gross = sale.salePrice;

  final feeShare = gross <= 0 ? 0 : sale.platformFee / gross * 100;
  final shippingShare = gross <= 0 ? 0 : sale.shippingByMe / gross * 100;
  final netShare = gross <= 0 ? 0 : sale.finalNet / gross * 100;

  return SaleNetBreakdownModel(
    salePrice: sale.salePrice,
    platformFee: sale.platformFee,
    shippingByMe: sale.shippingByMe,
    finalNet: sale.finalNet,
    quantity: sale.quantity,
    unitNet: sale.unitNet,
    feeSharePercent: feeShare,
    shippingSharePercent: shippingShare,
    netSharePercent: netShare,
  );
});