import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseBaseCurrencyPreviewCard extends StatelessWidget {
  final PurchaseModel purchase;
  final String baseCurrency;

  const PurchaseBaseCurrencyPreviewCard({
    super.key,
    required this.purchase,
    required this.baseCurrency,
  });

  @override
  Widget build(BuildContext context) {
    final converted = purchase.finalTotal * purchase.exchangeRate;

    return Card(
      child: ListTile(
        title: const Text('Base Currency Preview'),
        subtitle: Text(
          '${purchase.finalTotal.toStringAsFixed(2)} ${purchase.currency} × ${purchase.exchangeRate.toStringAsFixed(4)}',
        ),
        trailing: Text(
          CurrencyFormatter.format(
            converted,
            currency: baseCurrency,
          ),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}