import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/app/theme/app_theme.dart';
import 'package:lego_trading_manager/core/bootstrap/app_bootstrap_screen.dart';

class LegoTradingApp extends ConsumerWidget {
  const LegoTradingApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'LEGO Trading Manager',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      home: const AppBootstrapScreen(),
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}