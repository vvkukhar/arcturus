import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:lego_trading_manager/core/network/network_core.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class AuthEngineState {
  final bool isAuthenticated;
  final bool isOfflineMode;
  final Map<String, dynamic>? user;
  const AuthEngineState({this.isAuthenticated = false, this.isOfflineMode = false, this.user});
}

class AuthEngine extends AsyncNotifier<AuthEngineState> {
  final _storage = const FlutterSecureStorage();

  @override
  Future<AuthEngineState> build() async {
    final token = await _storage.read(key: 'arcturus_jwt');
    final offline = await _storage.read(key: 'arcturus_offline') == 'true';

    if (offline) return const AuthEngineState(isAuthenticated: true, isOfflineMode: true);
    
    if (token != null) {
      try {
        final res = await ref.read(networkCoreProvider).request('GET', '/auth/me');
        return AuthEngineState(isAuthenticated: true, user: res);
      } catch (e) {
        await _storage.delete(key: 'arcturus_jwt');
        return const AuthEngineState();
      }
    }
    return const AuthEngineState();
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final res = await ref.read(networkCoreProvider).request('POST', '/auth/login', body: {
        'email': email,
        'password': password,
      });

      if (res != null && res['token'] != null) {
        await _storage.write(key: 'arcturus_jwt', value: res['token']);
        await ref.read(networkCoreProvider).initSocket();
        state = AsyncValue.data(AuthEngineState(isAuthenticated: true, user: res['user']));
      } else {
        throw Exception('Invalid response from server');
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      // ВАЖЛИВО: Передаємо реальну помилку, а не глушимо її
      throw Exception(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> register(String name, String email, String password, String inviteCode) async {
    state = const AsyncValue.loading();
    try {
      final res = await ref.read(networkCoreProvider).request('POST', '/auth/register', body: {
        'name': name,
        'email': email,
        'password': password,
        'inviteCode': inviteCode, 
      });

      if (res != null && res['token'] != null) {
        await _storage.write(key: 'arcturus_jwt', value: res['token']);
        await ref.read(networkCoreProvider).initSocket();
        state = AsyncValue.data(AuthEngineState(isAuthenticated: true, user: res['user']));
      } else {
        throw Exception('Invalid response from server');
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      throw Exception(e.toString().replaceAll('Exception: ', '')); 
    }
  }

  Future<void> enableOfflineMode() async {
    await _storage.write(key: 'arcturus_offline', value: 'true');
    ref.read(syncEngineProvider.notifier).setOfflineMode();
    state = const AsyncValue.data(AuthEngineState(isAuthenticated: true, isOfflineMode: true));
  }

  Future<void> logout() async {
    await _storage.delete(key: 'arcturus_jwt');
    await _storage.delete(key: 'arcturus_offline');
    ref.read(networkCoreProvider).dispose();
    state = const AsyncValue.data(AuthEngineState());
  }
}

final authEngineProvider = AsyncNotifierProvider<AuthEngine, AuthEngineState>(AuthEngine.new);