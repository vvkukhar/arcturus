import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseReportTextService {
  const PurchaseReportTextService();

  String build(PurchaseModel purchase) {
    final date = purchase.purchaseDate.toIso8601String().split('T').first;

    return [
      'Purchase ${purchase.id}',
      'Item: ${purchase.itemId}',
      'Source: ${purchase.source}',
      'Total: ${purchase.finalTotal.toStringAsFixed(2)} ${purchase.currency}',
      'Price: ${purchase.purchasePrice.toStringAsFixed(2)}',
      'Shipping: ${purchase.shippingCost.toStringAsFixed(2)}',
      'Extra: ${purchase.additionalCosts.toStringAsFixed(2)}',
      'Payment: ${purchase.paymentMethod.name}',
      'Date: $date',
      if ((purchase.sellerName ?? '').trim().isNotEmpty)
        'Seller: ${purchase.sellerName}',
      if ((purchase.note ?? '').trim().isNotEmpty) 'Note: ${purchase.note}',
    ].join(' | ');
  }
}