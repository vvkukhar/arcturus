import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/app_drawer.dart';

class MarketScreen extends ConsumerWidget {
  const MarketScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Market Intelligence', style: TextStyle(fontWeight: FontWeight.w900))),
      drawer: const AppDrawer(),
      body: const Center(
        child: Text(
          'Market data is synchronized from the web platform.',
          style: TextStyle(color: Colors.white54, fontSize: 16),
        ),
      ),
    );
  }
}