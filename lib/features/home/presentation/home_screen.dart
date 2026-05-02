import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/home/application/home_launch_block_provider.dart';
import 'package:lego_trading_manager/features/home/presentation/widgets/home_launch_block_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final launchBlock = ref.watch(homeLaunchBlockProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          HomeLaunchBlockCard(
            model: launchBlock,
            onOpenDashboard: () {
              Navigator.of(context).pushNamed(AppRouter.dashboard);
            },
          ),
        ],
      ),
    );
  }
}
