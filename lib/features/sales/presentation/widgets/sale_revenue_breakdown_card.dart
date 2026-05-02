import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleRevenueBreakdownCard extends StatelessWidget {
  final SaleModel sale;

  const SaleRevenueBreakdownCard({
    super.key,
    required this.sale,
  });

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row(
              'Sale Price',
              CurrencyFormatter.format(
                sale.salePrice,
                currency: sale.currency,
              ),
            ),
            _row(
              'Platform Fee',
              CurrencyFormatter.format(
                sale.platformFee,
                currency: sale.currency,
              ),
            ),
            _row(
              'Shipping By Me',
              CurrencyFormatter.format(
                sale.shippingByMe,
                currency: sale.currency,
              ),
            ),
            _row('Quantity', sale.quantity.toString()),
            const Divider(),
            _row(
              'Final Net',
              CurrencyFormatter.format(
                sale.finalNet,
                currency: sale.currency,
              ),
            ),
            _row(
              'Unit Net',
              CurrencyFormatter.format(
                sale.unitNet,
                currency: sale.currency,
              ),
            ),
          ],
        ),
      ),
    );
  }
}