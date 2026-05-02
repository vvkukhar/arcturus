import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_state.dart';

class CurrencyStatusCard extends StatelessWidget {
  final CurrencyRateState state;

  const CurrencyStatusCard({
    super.key,
    required this.state,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text('Source: ${state.source.name}'),
        subtitle: Text(
          state.error == null
              ? 'Rates: ${state.rates.length}'
              : 'Error: ${state.error}',
        ),
      ),
    );
  }
}