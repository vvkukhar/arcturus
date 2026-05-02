import 'package:flutter/material.dart';

class BaseCurrencyCard extends StatelessWidget {
  final String currency;

  const BaseCurrencyCard({
    super.key,
    required this.currency,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: const Text('Base Currency'),
        trailing: Text(
          currency,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}