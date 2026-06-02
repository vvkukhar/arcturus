import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:url_launcher/url_launcher.dart';

class VaultEngineState {
  final double balance;
  final List<dynamic> portfolio;
  final List<dynamic> deals;

  const VaultEngineState({
    required this.balance,
    required this.portfolio,
    required this.deals,
  });
}

class VaultEngine extends AsyncNotifier<VaultEngineState> {
  @override
  Future<VaultEngineState> build() async {
    final network = ref.read(networkCoreProvider);
    try {
      final balRes = await network.request('GET', '/vault/balance');
      final portRes = await network.request('GET', '/vault/portfolio');
      final dealsRes = await network.request('GET', '/pro/deals');

      return VaultEngineState(
        balance: double.tryParse(balRes.toString()) ?? 0.0,
        portfolio: portRes is List ? portRes : [],
        deals: dealsRes is List ? dealsRes : [],
      );
    } catch (e) {
      return const VaultEngineState(balance: 0.0, portfolio: [], deals: []);
    }
  }

  Future<void> deposit(double amount) async {
    final network = ref.read(networkCoreProvider);
    final res = await network.request('POST', '/vault/deposit', body: {'amount': amount});
    if (res is Map && res['url'] != null) {
      final url = Uri.parse(res['url']);
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    }
    ref.invalidateSelf();
  }

  Future<void> invest(String dealId) async {
    final network = ref.read(networkCoreProvider);
    await network.request('POST', '/vault/invest', body: {'dealId': dealId});
    ref.invalidateSelf();
  }
}

final vaultEngineProvider = AsyncNotifierProvider<VaultEngine, VaultEngineState>(VaultEngine.new);