import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/money_formatter.dart';

class MoneyText extends StatelessWidget {
  final num value;
  final String currency;
  final TextStyle? style;

  const MoneyText({
    super.key,
    required this.value,
    required this.currency,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      MoneyFormatter.format(value, currency: currency),
      style: style,
    );
  }
}