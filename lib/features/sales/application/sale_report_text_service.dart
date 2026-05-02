import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleReportTextService {
  const SaleReportTextService();

  String build(SaleModel sale) {
    final date = sale.saleDate.toIso8601String().split('T').first;

    return [
      'Sale ${sale.id}',
      'Item: ${sale.itemId}',
      'Platform: ${sale.platform}',
      'Quantity: ${sale.quantity}',
      'Sale price: ${sale.salePrice.toStringAsFixed(2)}',
      'Platform fee: ${sale.platformFee.toStringAsFixed(2)}',
      'Shipping by me: ${sale.shippingByMe.toStringAsFixed(2)}',
      'Final net: ${sale.finalNet.toStringAsFixed(2)}',
      'Unit net: ${sale.unitNet.toStringAsFixed(2)}',
      'Currency: ${sale.currency}',
      'Date: $date',
      if ((sale.buyerName ?? '').trim().isNotEmpty)
        'Buyer: ${sale.buyerName}',
      if ((sale.note ?? '').trim().isNotEmpty) 'Note: ${sale.note}',
    ].join(' | ');
  }
}