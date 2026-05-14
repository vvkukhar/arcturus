import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/bootstrap/app_bootstrap_controller.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_live_screen.dart';
import 'package:lego_trading_manager/features/auth/presentation/login_screen.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class AppBootstrapScreen extends ConsumerStatefulWidget {
  const AppBootstrapScreen({super.key});

  @override
  ConsumerState<AppBootstrapScreen> createState() => _AppBootstrapScreenState();
}

class _AppBootstrapScreenState extends ConsumerState<AppBootstrapScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(appBootstrapControllerProvider.notifier).load();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appBootstrapControllerProvider);
    final i18n = ref.watch(i18nProvider.notifier);

    return state.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stackTrace) => Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 48, color: Colors.redAccent),
                const SizedBox(height: 16),
                Text(i18n.t('bootstrap.error'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                const SizedBox(height: 8),
                Text(error.toString(), textAlign: TextAlign.center, style: const TextStyle(color: Colors.white54)),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: () => ref.read(appBootstrapControllerProvider.notifier).load(),
                  child: Text(i18n.t('bootstrap.retry')),
                ),
              ],
            ),
          ),
        ),
      ),
      data: (isAuthenticated) {
        if (!isAuthenticated) {
          return const LoginScreen();
        }
        return const DashboardLiveScreen();
      },
    );
  }
}