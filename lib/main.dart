import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/bootstrap/app_bootstrap_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    const ProviderScope(
      child: LegoTradingManagerApp(),
    ),
  );
}

class LegoTradingManagerApp extends StatelessWidget {
  const LegoTradingManagerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LEGO Trading Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(useMaterial3: true),
      home: const AppBootstrapScreen(),
    );
  }
}