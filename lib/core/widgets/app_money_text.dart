import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';

class AppMoneyText extends StatelessWidget {
  final double value;
  final String currency;
  final int decimals;
  final FontWeight fontWeight;

  const AppMoneyText({
    super.key,
    required this.value,
    required this.currency,
    this.decimals = 2,
    this.fontWeight = FontWeight.w700,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      CurrencyFormatter.format(
        value,
        currency: currency,
        decimals: decimals,
      ),
      style: TextStyle(fontWeight: fontWeight),
    );
  }
}
