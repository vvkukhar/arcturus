// lib/app/router/app_routes.dart
import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/search/presentation/global_search_screen.dart';

Map<String, WidgetBuilder> appRoutes = {
  '/global-search': (_) => const GlobalSearchScreen(),
};
